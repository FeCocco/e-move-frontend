"use client";
import { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { AppCard } from "@/components/AppCard/AppCard";
import { AddressSearch } from "@/components/AddressSearch";
import polyline from '@mapbox/polyline';
import * as turf from '@turf/turf';

// --- Importações de API e UI ---
import { fetchDirectRoute, buscarEstacoesProximas } from "@/lib/api";
import { Loader2, AlertTriangle, CheckCircle, Rocket, Zap } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// --- Contexto ---
import { useVeiculos } from "@/context/VeiculosContext";
import { useViagens } from "@/context/ViagensContext";

const GLOBE_STYLE = 'https://demotiles.maplibre.org/globe.json';
const VOYAGER_STYLE = 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json';
const ZOOM_THRESHOLD = 3;
const ROUTE_SOURCE_ID = 'route-source';
const ROUTE_LAYER_ID = 'route-layer';

const routeCache = new Map();
const getCacheKey = (origin, destination) => {
    return `${origin.latitude},${origin.longitude}-${destination.latitude},${destination.longitude}`;
};

export default function AbaMapa({ isVisible }) {
    // --- Refs ---
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const currentStyleRef = useRef('globe');
    const originMarkerRef = useRef(null);
    const destinationMarkerRef = useRef(null);
    const routeDataRef = useRef(null);

    // Ref para guardar os marcadores de estação
    const stationMarkersRef = useRef([]);

    // --- Estados ---
    const [origin, setOrigin] = useState(null);
    const [destination, setDestination] = useState(null);
    const [isRouteLoading, setIsRouteLoading] = useState(false);
    const [routeError, setRouteError] = useState(null);
    const [totalDistance, setTotalDistance] = useState(null);

    const { meusVeiculos, loading: veiculosLoading } = useVeiculos();
    const { salvarViagem, rotaParaCarregar, setRotaParaCarregar } = useViagens();

    const [selectedVehicleId, setSelectedVehicleId] = useState(null);
    const selectedVehicle = meusVeiculos.find(v => String(v.id) === selectedVehicleId) || null;

    const [autonomyReport, setAutonomyReport] = useState(null);
    const [isSavingTrip, setIsSavingTrip] = useState(false);

    const [waypoints, setWaypoints] = useState([]);

    // --- ALGORITMO DE ROTA COM AUTONOMIA ---
    const calcularRotaComAutonomia = async (pontoOrigem, pontoDestino, veiculo) => {
        if (!veiculo) {
            const response = await fetchDirectRoute(pontoOrigem, pontoDestino);
            return {
                rotas: [response.data.routes[0]],
                paradas: []
            };
        }

        let rotaFinal = [];
        let pontosDeParada = [];
        let origemAtual = { ...pontoOrigem };
        let destinoFinal = { ...pontoDestino };

        // Garante que temos números válidos para a bateria
        let autonomiaDisponivel = veiculo.autonomiaEstimada || 0;
        let autonomiaTotalCarro = veiculo.autonomiaTotal || 0;

        // Se a autonomia estimada estiver zerada (bateria 0%), evita divisão por zero
        if (autonomiaDisponivel <= 0) autonomiaDisponivel = 10;
        if (autonomiaTotalCarro <= 0) autonomiaTotalCarro = autonomiaDisponivel / ((veiculo.nivelBateria || 100) / 100);

        const bufferSeguranca = autonomiaTotalCarro * 0.20;

        let chegouAoDestino = false;
        let iteracoes = 0;

        while (!chegouAoDestino && iteracoes < 5) {
            iteracoes++;

            const response = await fetchDirectRoute(origemAtual, destinoFinal);
            if (!response.data || !response.data.routes[0]) throw new Error("Rota não encontrada pela API.");

            const routeData = response.data.routes[0];
            const distanciaRotaKm = routeData.distance / 1000;
            const geometriaRota = routeData.geometry;

            // Capacidade atual menos a reserva
            const capacidadeViagem = autonomiaDisponivel - bufferSeguranca;

            if (distanciaRotaKm <= capacidadeViagem && capacidadeViagem > 0) {
                rotaFinal.push(routeData);
                chegouAoDestino = true;
            } else {
                const coordenadasLinha = polyline.decode(geometriaRota).map(c => [c[1], c[0]]);
                const lineString = turf.lineString(coordenadasLinha);

                const distanciaParaParar = Math.max(5, capacidadeViagem);
                const pontoIdealParada = turf.along(lineString, distanciaParaParar, {units: 'kilometers'});
                const [lonParada, latParada] = pontoIdealParada.geometry.coordinates;

                // Busca estações (Raio aumentado para 50km para garantir resultados em testes)
                const estacoes = await buscarEstacoesProximas(latParada, lonParada, 50);

                if (!estacoes.data || estacoes.data.length === 0) {
                    // Se não achar, tenta seguir até o fim da autonomia sem buffer (modo emergência)
                    if (iteracoes === 1 && distanciaRotaKm < autonomiaDisponivel) {
                        rotaFinal.push(routeData);
                        chegouAoDestino = true;
                        toast.warning("Atenção: Chegará ao destino com bateria na reserva!");
                        break;
                    }
                    throw new Error(`Sem estações de recarga no alcance (km ${distanciaParaParar.toFixed(0)})!`);
                }

                const melhorEstacao = estacoes.data[0];
                pontosDeParada.push(melhorEstacao);

                const rotaAteEstacao = await fetchDirectRoute(origemAtual, {
                    latitude: melhorEstacao.AddressInfo.Latitude,
                    longitude: melhorEstacao.AddressInfo.Longitude
                });
                rotaFinal.push(rotaAteEstacao.data.routes[0]);

                origemAtual = {
                    latitude: melhorEstacao.AddressInfo.Latitude,
                    longitude: melhorEstacao.AddressInfo.Longitude
                };

                autonomiaDisponivel = autonomiaTotalCarro;
            }
        }

        return { rotas: rotaFinal, paradas: pontosDeParada };
    };

    const drawRoute = useCallback((map, geoJson) => {
        if (!map || !geoJson) return;

        const attemptDraw = () => {
            if (!map.isStyleLoaded()) return false;
            try {
                if (map.getLayer(ROUTE_LAYER_ID)) map.removeLayer(ROUTE_LAYER_ID);
                if (map.getSource(ROUTE_SOURCE_ID)) map.removeSource(ROUTE_SOURCE_ID);

                map.addSource(ROUTE_SOURCE_ID, { type: 'geojson', data: geoJson });
                map.addLayer({
                    id: ROUTE_LAYER_ID,
                    type: 'line',
                    source: ROUTE_SOURCE_ID,
                    layout: { 'line-join': 'round', 'line-cap': 'round' },
                    paint: {
                        'line-color': '#00BFFF',
                        'line-width': ['interpolate', ['exponential', 1.5], ['zoom'], 0, 2, 5, 4, 10, 6, 15, 8],
                        'line-opacity': 0.9
                    }
                });
                return true;
            } catch (error) {
                console.error("Erro ao desenhar rota:", error);
                return false;
            }
        };
        if (attemptDraw()) return;
        const checkInterval = setInterval(() => { if (attemptDraw()) clearInterval(checkInterval); }, 50);
        setTimeout(() => clearInterval(checkInterval), 3000);
    }, []);

    const clearRoute = useCallback((map) => {
        if (!map) return;
        try {
            if (map.getLayer(ROUTE_LAYER_ID)) map.removeLayer(ROUTE_LAYER_ID);
            if (map.getSource(ROUTE_SOURCE_ID)) map.removeSource(ROUTE_SOURCE_ID);
        } catch (error) { console.error("Erro ao limpar rota:", error); }

        routeDataRef.current = null;
        setRouteError(null);
        setAutonomyReport(null);
        setTotalDistance(null);
        setWaypoints([]);

        stationMarkersRef.current.forEach(marker => marker.remove());
        stationMarkersRef.current = [];

    }, []);

    const forceClearRoute = useCallback((map) => {
        clearRoute(map);
        try {
            if (originMarkerRef.current) { originMarkerRef.current.remove(); originMarkerRef.current = null; }
            if (destinationMarkerRef.current) { destinationMarkerRef.current.remove(); destinationMarkerRef.current = null; }
            setOrigin(null);
            setDestination(null);
            setSelectedVehicleId(null);
            map.flyTo({ center: [-54, -15], zoom: 1.5 });
        } catch (error) { console.error("Erro ao forçar limpeza:", error); }
    }, [clearRoute]);

    useEffect(() => {
        if (isVisible && mapRef.current) {
            const timer = setTimeout(() => mapRef.current.resize(), 100);
            return () => clearTimeout(timer);
        }
    }, [isVisible]);

    useEffect(() => {
        if (mapRef.current) return;
        mapRef.current = new maplibregl.Map({
            container: mapContainerRef.current,
            style: GLOBE_STYLE,
            center: [-54, -15],
            zoom: 1.5,
            projection: 'globe'
        });
        const map = mapRef.current;
        map.on('style.load', () => {
            if (routeDataRef.current) setTimeout(() => drawRoute(map, routeDataRef.current), 50);
        });
        const handleZoom = () => {
            const currentZoom = map.getZoom();
            const targetStyle = currentZoom > ZOOM_THRESHOLD ? 'voyager' : 'globe';
            if (targetStyle !== currentStyleRef.current) {
                currentStyleRef.current = targetStyle;
                map.setStyle(targetStyle === 'voyager' ? VOYAGER_STYLE : GLOBE_STYLE);
            }
        };
        map.on('zoom', handleZoom);

        return () => {
            if (map) {
                map.off('zoom', handleZoom);
                map.remove();
            }
            mapRef.current = null;
        };
    }, [drawRoute]);

    // Marcador de Origem
    useEffect(() => {
        if (!mapRef.current) return;
        const map = mapRef.current;

        if (originMarkerRef.current) originMarkerRef.current.remove();

        if (origin && !isNaN(origin.latitude) && !isNaN(origin.longitude)) {
            const el = document.createElement('div');
            el.className = 'marker';
            el.style.cssText = 'width: 30px; height: 30px; border-radius: 50%; background-color: #22c55e; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3);';

            originMarkerRef.current = new maplibregl.Marker({ element: el })
                .setLngLat([origin.longitude, origin.latitude])
                .setPopup(new maplibregl.Popup({ offset: 25 }).setHTML(`<strong>Origem</strong><br>${origin.displayName || origin.address}`))
                .addTo(map);

            if (!destination) {
                map.flyTo({ center: [origin.longitude, origin.latitude], zoom: 12, duration: 1500 });
            }
        }
    }, [origin, destination]);

    // Marcador de Destino
    useEffect(() => {
        if (!mapRef.current) return;
        const map = mapRef.current;

        if (destinationMarkerRef.current) destinationMarkerRef.current.remove();

        if (destination && !isNaN(destination.latitude) && !isNaN(destination.longitude)) {
            const el = document.createElement('div');
            el.className = 'marker';
            el.style.cssText = 'width: 30px; height: 30px; border-radius: 50%; background-color: #ef4444; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3);';

            destinationMarkerRef.current = new maplibregl.Marker({ element: el })
                .setLngLat([destination.longitude, destination.latitude])
                .setPopup(new maplibregl.Popup({ offset: 25 }).setHTML(`<strong>Destino</strong><br>${destination.displayName || destination.address}`))
                .addTo(map);

            if (!origin) {
                map.flyTo({ center: [destination.longitude, destination.latitude], zoom: 12, duration: 1500 });
            }
        }
    }, [destination, origin]);


    // --- WAYPOINTS ---
    useEffect(() => {
        if (!mapRef.current) return;

        stationMarkersRef.current.forEach(m => m.remove());
        stationMarkersRef.current = [];

        waypoints.forEach(estacao => {
            const el = document.createElement('div');
            el.className = 'marker-estacao flex items-center justify-center bg-white rounded-full shadow-lg border-2 border-verde-claro w-8 h-8 cursor-pointer hover:scale-110 transition-transform';
            el.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>';

            const info = estacao.AddressInfo;
            const conn = estacao.Connections?.[0];

            const popupHTML = `
                <div class="p-2 text-slate-900 min-w-[200px]">
                    <strong class="text-sm block mb-1">${info.Title}</strong>
                    <span class="text-xs text-slate-500 block mb-2">${info.AddressLine1 || 'Endereço não disponível'}</span>
                    <div class="flex items-center gap-1 bg-verde-claro/10 p-1 rounded text-verde-claro text-xs font-bold w-fit">
                        ⚡ ${conn ? conn.PowerKW + ' kW' : 'Potência desc.'}
                    </div>
                </div>
            `;

            const marker = new maplibregl.Marker({ element: el })
                .setLngLat([info.Longitude, info.Latitude])
                .setPopup(new maplibregl.Popup({ offset: 15, closeButton: false }).setHTML(popupHTML))
                .addTo(mapRef.current);

            stationMarkersRef.current.push(marker);
        });
    }, [waypoints]);

    // --- CÁLCULO DA ROTA ---
    useEffect(() => {
        if (!mapRef.current) return;
        const map = mapRef.current;

        if (origin && destination) {
            const executarCalculo = async () => {
                setIsRouteLoading(true);
                setRouteError(null);
                setTotalDistance(null);
                setAutonomyReport(null);
                setWaypoints([]);

                try {
                    const resultado = await calcularRotaComAutonomia(origin, destination, selectedVehicle);

                    if (resultado) {
                        const { rotas, paradas } = resultado;

                        const todasCoordenadas = [];
                        let distTotal = 0;

                        rotas.forEach(r => {
                            const coords = polyline.decode(r.geometry).map(c => [c[1], c[0]]);
                            todasCoordenadas.push(...coords);
                            distTotal += r.distance;
                        });

                        const geoJson = {
                            type: 'Feature',
                            geometry: { type: 'LineString', coordinates: todasCoordenadas }
                        };

                        setTotalDistance(distTotal);
                        routeDataRef.current = geoJson;
                        drawRoute(map, geoJson);
                        setWaypoints(paradas);

                        const bounds = new maplibregl.LngLatBounds();
                        bounds.extend([origin.longitude, origin.latitude]);
                        bounds.extend([destination.longitude, destination.latitude]);
                        paradas.forEach(p => bounds.extend([p.AddressInfo.Longitude, p.AddressInfo.Latitude]));

                        map.fitBounds(bounds, { padding: 100, duration: 1500 });
                    }

                } catch (error) {
                    console.error("Erro na rota:", error);
                    setRouteError("Erro ao calcular rota: " + (error.message || "Tente novamente."));
                } finally {
                    setIsRouteLoading(false);
                }
            };

            executarCalculo();
        } else {
            clearRoute(map);
        }
    }, [origin, destination, selectedVehicle, drawRoute, clearRoute]);

    // --- CONTEXT BRIDGE ---
    useEffect(() => {
        if (rotaParaCarregar && isVisible) {
            setOrigin({
                latitude: rotaParaCarregar.latOrigem,
                longitude: rotaParaCarregar.longiOrigem,
                address: "", displayName: "Origem"
            });
            setDestination({
                latitude: rotaParaCarregar.latDestino,
                longitude: rotaParaCarregar.longiDestino,
                address: "", displayName: rotaParaCarregar.apelido || "Destino"
            });
            setRotaParaCarregar(null);
        }
    }, [rotaParaCarregar, isVisible, setRotaParaCarregar]);

    // --- RELATÓRIO DE AUTONOMIA ---
    useEffect(() => {
        if (totalDistance && selectedVehicle) {
            const distanceInKm = totalDistance / 1000;
            const autonomy = selectedVehicle.autonomiaEstimada;
            const diff = autonomy - distanceInKm;

            if (waypoints.length > 0) {
                setAutonomyReport({
                    status: 'success',
                    message: `Rota calculada com ${waypoints.length} parada(s) para recarga.`
                });
            } else if (diff >= 0) {
                setAutonomyReport({
                    status: 'success',
                    message: `Viagem tranquila! Seu ${selectedVehicle.modelo} tem ${diff.toFixed(0)} km de autonomia sobrando.`
                });
            } else {
                //algoritmo não achou paradas e a autonomia não dá
                setAutonomyReport({
                    status: 'error',
                    message: `Atenção: Autonomia insuficiente e sem estações encontradas.`
                });
            }
        } else {
            setAutonomyReport(null);
        }
    }, [totalDistance, selectedVehicle, waypoints]);

    const canStartTrip = origin && destination && selectedVehicle && totalDistance;

    const handleIniciarRota = async () => {
        if (!canStartTrip) return;
        setIsSavingTrip(true);
        try {
            const co2Salvo = (totalDistance / 1000) * 0.12;
            const viagemData = {
                veiculoId: selectedVehicle.id,
                kmTotal: totalDistance / 1000,
                co2Preservado: co2Salvo,
                favorita: false,
                latOrigem: origin.latitude,
                longiOrigem: origin.longitude,
                latDestino: destination.latitude,
                longiDestino: destination.longitude,
            };
            await salvarViagem(viagemData);
        } catch (err) {
            console.error("Erro ao salvar:", err);
        } finally {
            setIsSavingTrip(false);
        }
    };

    return (
        <>
            <AppCard className="bg-black/20 p-3 rounded-lg w-full text-left mb-2 text-sm space-y-1">
                <h3 className="mb-1">Origem:</h3>
                <AddressSearch placeholder="Endereço de Origem" value={origin} onSelectLocation={setOrigin} />
                <h3 className="mb-1">Destino:</h3>
                <AddressSearch placeholder="Endereço de Destino" value={destination} onSelectLocation={setDestination} />

                <Label htmlFor="vehicle-select" className="mb-1 mt-2">Veículo para a Rota:</Label>
                <Select value={selectedVehicleId || undefined} onValueChange={setSelectedVehicleId} disabled={veiculosLoading}>
                    <SelectTrigger id="vehicle-select" className="w-full justify-start text-left h-9">
                        <SelectValue placeholder={veiculosLoading ? "Carregando..." : "Selecione seu veículo..."} />
                    </SelectTrigger>
                    <SelectContent>
                        {!veiculosLoading && meusVeiculos.map(v => (
                            <SelectItem key={v.id} value={String(v.id)}>
                                {v.marca} {v.modelo} (Bat: {v.nivelBateria}%)
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {isRouteLoading && (
                    <div className="flex items-center justify-center gap-2 p-2 text-azul-claro">
                        <Loader2 className="h-4 w-4 animate-spin" /> <span>Calculando rota inteligente...</span>
                    </div>
                )}
                {routeError && (
                    <div className="flex items-center justify-center gap-2 p-2 text-vermelho-status">
                        <AlertTriangle className="h-4 w-4" /> <span>{routeError}</span>
                    </div>
                )}
                {!isRouteLoading && totalDistance && (
                    <div className="flex flex-col items-center justify-center gap-2 p-2 text-texto-claro">
                        <p>Distância Total: <span className="font-bold text-lg">{(totalDistance / 1000).toFixed(2)} km</span></p>

                        {/* Relatório de Paradas */}
                        {waypoints.length > 0 ? (
                            <div className="flex flex-col items-center gap-1 w-full">
                                <div className="flex items-center gap-2 bg-amarelo-status/10 text-amarelo-status p-2 rounded-md w-full justify-center">
                                    <Zap className="h-4 w-4" />
                                    <span className="text-xs font-bold">Necessário {waypoints.length} recarga(s)</span>
                                </div>
                                <p className="text-xs text-texto-claro/50">Pontos de recarga adicionados ao mapa</p>
                            </div>
                        ) : (
                            autonomyReport && (
                                <div className={`flex items-center gap-2 p-2 rounded-md w-full justify-center ${autonomyReport.status === 'success' ? 'bg-verde-claro/10 text-verde-claro' : 'bg-vermelho-status/10 text-vermelho-status'}`}>
                                    {autonomyReport.status === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                                    <span className="text-xs text-center">{autonomyReport.message}</span>
                                </div>
                            )
                        )}
                    </div>
                )}
                {!isRouteLoading && totalDistance && (
                    <Button variant={canStartTrip ? "botaoazul" : "ghost"} disabled={!canStartTrip || isSavingTrip} onClick={handleIniciarRota} className="w-full mt-2">
                        {isSavingTrip ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
                        <span>{isSavingTrip ? "Salvando..." : "Iniciar Rota e Salvar"}</span>
                    </Button>
                )}
                <Button variant="ghost" onClick={() => forceClearRoute(mapRef.current)}>Limpar Rota</Button>
            </AppCard>
            <div ref={mapContainerRef} id="map" style={{ width: '100%', height: '400px' }} className="rounded-xl" />
        </>
    );
}