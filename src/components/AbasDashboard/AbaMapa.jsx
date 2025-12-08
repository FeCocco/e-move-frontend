"use client";
import { useEffect, useRef, useState, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { AppCard } from "@/components/AppCard/AppCard";
import { AddressSearch } from "@/components/AddressSearch";
import polyline from '@mapbox/polyline';
import * as turf from '@turf/turf';
import StationPopup from "@/components/Map/StationPopup";

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

import { useVeiculos } from "@/context/VeiculosContext";
import { useViagens } from "@/context/ViagensContext";
import { useEstacoes } from "@/context/EstacoesContext";

const GLOBE_STYLE = 'https://demotiles.maplibre.org/globe.json';
const VOYAGER_STYLE = 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json';
const ZOOM_THRESHOLD = 3;
const ROUTE_SOURCE_ID = 'route-source';
const ROUTE_LAYER_ID = 'route-layer';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default function AbaMapa({ isVisible }) {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const currentStyleRef = useRef('globe');
    const originMarkerRef = useRef(null);
    const destinationMarkerRef = useRef(null);
    const routeDataRef = useRef(null);
    const stationMarkersRef = useRef([]);

    const [origin, setOrigin] = useState(null);
    const [destination, setDestination] = useState(null);
    const [isRouteLoading, setIsRouteLoading] = useState(false);
    const [routeError, setRouteError] = useState(null);
    const [totalDistance, setTotalDistance] = useState(null);

    const { meusVeiculos, loading: veiculosLoading } = useVeiculos();
    const { salvarViagem, rotaParaCarregar, setRotaParaCarregar } = useViagens();
    const { isFavorita, toggleFavorita } = useEstacoes();

    const [selectedVehicleId, setSelectedVehicleId] = useState(null);
    const selectedVehicle = meusVeiculos.find(v => String(v.id) === selectedVehicleId) || null;

    const [autonomyReport, setAutonomyReport] = useState(null);
    const [isSavingTrip, setIsSavingTrip] = useState(false);
    const [waypoints, setWaypoints] = useState([]);

    // --- FUNÇÃO CORRIGIDA E POSICIONADA CORRETAMENTE ---
    const calcularRotaComAutonomia = async (pontoOrigem, pontoDestino, veiculo) => {
        // Se não tiver veículo, rota simples
        if (!veiculo) {
            const response = await fetchDirectRoute(pontoOrigem, pontoDestino);
            return { rotas: [response.data.routes[0]], paradas: [] };
        }

        let rotaFinal = [];
        let pontosDeParada = [];
        let origemAtual = { ...pontoOrigem };
        let destinoFinal = { ...pontoDestino };

        let autonomiaAtualKm = veiculo.autonomiaEstimada || 0;
        const autonomiaTotalKm = veiculo.autonomiaTotal || 400;

        if (autonomiaAtualKm <= 0) autonomiaAtualKm = 10;

        // Reserva: 20% do total
        const kmReserva = autonomiaTotalKm * 0.20;

        let chegouAoDestino = false;
        let iteracoes = 0;

        while (!chegouAoDestino && iteracoes < 5) {
            iteracoes++;

            if (iteracoes > 1) {
                // Espera 1.1s entre chamadas para respeitar o limite de 2 req/s da LocationIQ
                await sleep(1100);
            }

            // 1. Busca rota da perna atual
            const response = await fetchDirectRoute(origemAtual, destinoFinal);
            if (!response.data || !response.data.routes[0]) throw new Error("Rota não encontrada pela API.");

            const routeData = response.data.routes[0];
            const distanciaRotaKm = routeData.distance / 1000;
            const geometriaRota = routeData.geometry;

            // 2. Calcula alcance seguro (Bateria Atual - Reserva)
            const alcanceSeguro = autonomiaAtualKm - kmReserva;

            if (distanciaRotaKm <= alcanceSeguro && alcanceSeguro > 0) {
                // Chega sem parar
                rotaFinal.push(routeData);
                chegouAoDestino = true;
            } else {
                // Precisa parar
                const coordenadasLinha = polyline.decode(geometriaRota).map(c => [c[1], c[0]]);
                const lineString = turf.lineString(coordenadasLinha);

                // Ponto onde atinge a reserva (ou anda um pouco se já estiver nela)
                const distanciaAteParada = Math.max(10, alcanceSeguro);
                const pontoIdealParada = turf.along(lineString, distanciaAteParada, { units: 'kilometers' });
                const [lonParada, latParada] = pontoIdealParada.geometry.coordinates;

                // 3. Busca estações no raio da bateria restante (Reserva)
                const raioDeBuscaKm = kmReserva * 0.95;

                try {
                    const estacoes = await buscarEstacoesProximas(latParada, lonParada, raioDeBuscaKm);

                    if (!estacoes.data || estacoes.data.length === 0) {
                        if (iteracoes === 1 && distanciaRotaKm < autonomiaAtualKm) {
                            rotaFinal.push(routeData);
                            chegouAoDestino = true;
                            toast.warning("Destino alcançável, mas chegará na reserva!");
                            break;
                        }
                        throw new Error(`Sem estações no raio de ${raioDeBuscaKm.toFixed(0)}km!`);
                    }

                    const melhorEstacao = estacoes.data[0];
                    pontosDeParada.push(melhorEstacao);

                    // Rota até a estação
                    const rotaAteEstacao = await fetchDirectRoute(origemAtual, {
                        latitude: melhorEstacao.AddressInfo.Latitude,
                        longitude: melhorEstacao.AddressInfo.Longitude
                    });
                    rotaFinal.push(rotaAteEstacao.data.routes[0]);

                    // Atualiza origem para a estação (simula recarga)
                    origemAtual = {
                        latitude: melhorEstacao.AddressInfo.Latitude,
                        longitude: melhorEstacao.AddressInfo.Longitude
                    };

                    // Recarrega para 90%
                    autonomiaAtualKm = autonomiaTotalKm * 0.9;

                } catch (error) {
                    if (error.response && error.response.status === 403) {
                        throw new Error("Sessão expirada. Faça login novamente para buscar estações.");
                    }
                    throw error;
                }
            }
        }

        return { rotas: rotaFinal, paradas: pontosDeParada };
    };

    // --- FUNÇÕES DE MAPA ---
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
            } catch (error) { return false; }
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
        } catch (error) {}
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
        } catch (error) {}
    }, [clearRoute]);

    // --- EFEITOS ---
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
        map.on('zoom', () => {
            const currentZoom = map.getZoom();
            const targetStyle = currentZoom > ZOOM_THRESHOLD ? 'voyager' : 'globe';
            if (targetStyle !== currentStyleRef.current) {
                currentStyleRef.current = targetStyle;
                map.setStyle(targetStyle === 'voyager' ? VOYAGER_STYLE : GLOBE_STYLE);
            }
        });
        return () => { if (map) map.remove(); mapRef.current = null; };
    }, [drawRoute]);

    useEffect(() => {
        if (!mapRef.current) return;
        if (originMarkerRef.current) originMarkerRef.current.remove();
        if (origin && origin.latitude) {
            const el = document.createElement('div');
            el.className = 'marker bg-green-500 w-4 h-4 rounded-full border-2 border-white shadow-lg';
            originMarkerRef.current = new maplibregl.Marker({ element: el })
                .setLngLat([origin.longitude, origin.latitude])
                .setPopup(new maplibregl.Popup({ offset: 25 }).setHTML(`<strong>Origem</strong><br>${origin.displayName || ''}`))
                .addTo(mapRef.current);
            if (!destination) mapRef.current.flyTo({ center: [origin.longitude, origin.latitude], zoom: 12 });
        }
    }, [origin, destination]);

    useEffect(() => {
        if (!mapRef.current) return;
        if (destinationMarkerRef.current) destinationMarkerRef.current.remove();
        if (destination && destination.latitude) {
            const el = document.createElement('div');
            el.className = 'marker bg-red-500 w-4 h-4 rounded-full border-2 border-white shadow-lg';
            destinationMarkerRef.current = new maplibregl.Marker({ element: el })
                .setLngLat([destination.longitude, destination.latitude])
                .setPopup(new maplibregl.Popup({ offset: 25 }).setHTML(`<strong>Destino</strong><br>${destination.displayName || ''}`))
                .addTo(mapRef.current);
            if (!origin) mapRef.current.flyTo({ center: [destination.longitude, destination.latitude], zoom: 12 });
        }
    }, [destination, origin]);

    useEffect(() => {
        if (!mapRef.current) return;
        stationMarkersRef.current.forEach(m => m.remove());
        stationMarkersRef.current = [];

        waypoints.forEach(estacao => {
            const el = document.createElement('div');
            el.className = 'marker-estacao flex items-center justify-center bg-white rounded-full shadow-lg border-2 border-verde-claro w-8 h-8 cursor-pointer hover:scale-110 transition-transform';
            el.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>';

            const popupNode = document.createElement('div');
            const root = createRoot(popupNode);
            root.render(<StationPopup station={estacao} isFavorite={isFavorita(estacao.ID)} onToggleFavorite={toggleFavorita} />);

            const marker = new maplibregl.Marker({ element: el })
                .setLngLat([estacao.AddressInfo.Longitude, estacao.AddressInfo.Latitude])
                .setPopup(new maplibregl.Popup({ offset: 15, closeButton: false }).setDOMContent(popupNode))
                .addTo(mapRef.current);

            stationMarkersRef.current.push(marker);
        });
    }, [waypoints, isFavorita, toggleFavorita]);

    // --- CÁLCULO PRINCIPAL ---
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
                    // AGORA SIM: A função existe no escopo!
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

                        const geoJson = { type: 'Feature', geometry: { type: 'LineString', coordinates: todasCoordenadas } };
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

    // Context & Relatorio
    useEffect(() => {
        if (rotaParaCarregar && isVisible) {
            setOrigin({ latitude: rotaParaCarregar.latOrigem, longitude: rotaParaCarregar.longiOrigem, address: "", displayName: "Origem" });
            setDestination({ latitude: rotaParaCarregar.latDestino, longitude: rotaParaCarregar.longiDestino, address: "", displayName: rotaParaCarregar.apelido || "Destino" });
            setRotaParaCarregar(null);
        }
    }, [rotaParaCarregar, isVisible, setRotaParaCarregar]);

    useEffect(() => {
        if (totalDistance && selectedVehicle) {
            const distanceInKm = totalDistance / 1000;
            const autonomy = selectedVehicle.autonomiaEstimada;
            const diff = autonomy - distanceInKm;

            if (waypoints.length > 0) {
                setAutonomyReport({ status: 'success', message: `Rota calculada com ${waypoints.length} parada(s) para recarga.` });
            } else if (diff >= 0) {
                setAutonomyReport({ status: 'success', message: `Viagem tranquila! Sobram ${diff.toFixed(0)} km.` });
            } else {
                setAutonomyReport({ status: 'error', message: `Atenção: Autonomia insuficiente.` });
            }
        } else {
            setAutonomyReport(null);
        }
    }, [totalDistance, selectedVehicle, waypoints]);

    const handleIniciarRota = async () => {
        if (!origin || !destination || !selectedVehicle || !totalDistance) return;
        setIsSavingTrip(true);
        try {
            await salvarViagem({
                veiculoId: selectedVehicle.id,
                kmTotal: totalDistance / 1000,
                co2Preservado: (totalDistance / 1000) * 0.12,
                favorita: false,
                latOrigem: origin.latitude,
                longiOrigem: origin.longitude,
                latDestino: destination.latitude,
                longiDestino: destination.longitude,
            });
        } catch (err) { console.error(err); } finally { setIsSavingTrip(false); }
    };

    const canStartTrip = origin && destination && selectedVehicle && totalDistance;

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

                {isRouteLoading && <div className="flex items-center justify-center gap-2 p-2 text-azul-claro"><Loader2 className="animate-spin h-4 w-4"/> <span>Calculando...</span></div>}
                {routeError && <div className="flex items-center justify-center gap-2 p-2 text-vermelho-status"><AlertTriangle className="h-4 w-4"/> <span>{routeError}</span></div>}

                {!isRouteLoading && totalDistance && (
                    <div className="flex flex-col items-center justify-center gap-2 p-2 text-texto-claro">
                        <p>Distância Total: <span className="font-bold text-lg">{(totalDistance / 1000).toFixed(2)} km</span></p>
                        {waypoints.length > 0 ? (
                            <div className="flex items-center gap-2 bg-amarelo-status/10 text-amarelo-status p-2 rounded-md w-full justify-center">
                                <Zap className="h-4 w-4" /> <span className="text-xs font-bold">Necessário {waypoints.length} recarga(s)</span>
                            </div>
                        ) : (
                            autonomyReport && (
                                <div className={`flex items-center gap-2 p-2 rounded-md w-full justify-center ${autonomyReport.status === 'success' ? 'bg-verde-claro/10 text-verde-claro' : 'bg-vermelho-status/10 text-vermelho-status'}`}>
                                    {autonomyReport.status === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                                    <span className="text-xs text-center">{autonomyReport.message}</span>
                                </div>
                            )
                        )}
                        <Button variant={canStartTrip ? "botaoazul" : "ghost"} disabled={!canStartTrip || isSavingTrip} onClick={handleIniciarRota} className="w-full mt-2">
                            {isSavingTrip ? <Loader2 className="animate-spin h-4 w-4"/> : <Rocket className="h-4 w-4"/>}
                            <span>{isSavingTrip ? "Salvando..." : "Iniciar Rota e Salvar"}</span>
                        </Button>
                    </div>
                )}
                <Button variant="ghost" onClick={() => forceClearRoute(mapRef.current)}>Limpar Rota</Button>
            </AppCard>
            <div ref={mapContainerRef} id="map" style={{ width: '100%', height: '400px' }} className="rounded-xl" />
        </>
    );
}