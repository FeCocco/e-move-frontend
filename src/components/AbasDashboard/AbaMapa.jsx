"use client";
import { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { AppCard } from "@/components/AppCard/AppCard";
import { AddressSearch } from "@/components/AddressSearch";
import polyline from '@mapbox/polyline';

// --- Importações de API e UI ---
import { fetchDirectRoute } from "@/lib/api"; // <-- MUDANÇA 1: 'salvarViagem' e 'toast' removidos daqui
import { Loader2, AlertTriangle, CheckCircle, Rocket } from 'lucide-react'; // Ícones
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// --- Contexto ---
import { useVeiculos } from "@/context/VeiculosContext";
import { useViagens } from "@/context/ViagensContext"; // Importação que você já tinha

// --- Constantes do Mapa ---
const GLOBE_STYLE = 'https://demotiles.maplibre.org/globe.json';
const VOYAGER_STYLE = 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json';
const ZOOM_THRESHOLD = 3;
const ROUTE_SOURCE_ID = 'route-source';
const ROUTE_LAYER_ID = 'route-layer';

// --- Cache ---
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

    // --- Estados do Mapa ---
    const [origin, setOrigin] = useState(null);
    const [destination, setDestination] = useState(null);
    const [isRouteLoading, setIsRouteLoading] = useState(false);
    const [routeError, setRouteError] = useState(null);
    const [totalDistance, setTotalDistance] = useState(null);

    // --- Estados da Rota/Veículo ---
    const { meusVeiculos, loading: veiculosLoading } = useVeiculos();
    const { salvarViagem } = useViagens(); // <-- MUDANÇA 2: Pegamos a função 'salvarViagem' do CONTEXTO
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [autonomyReport, setAutonomyReport] = useState(null);
    const [isSavingTrip, setIsSavingTrip] = useState(false);

    /*
    Desenha a linha da rota no mapa...
     */
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
        const checkInterval = setInterval(() => {
            if (attemptDraw()) clearInterval(checkInterval);
        }, 50);
        setTimeout(() => clearInterval(checkInterval), 3000);
    }, []);

    /*
    Limpa a camada e a fonte da rota do mapa
     */
    const clearRoute = useCallback((map) => {
        // ... (código para limpar a rota, sem alterações)
        if (!map) return;
        try {
            if (map.getLayer(ROUTE_LAYER_ID)) map.removeLayer(ROUTE_LAYER_ID);
            if (map.getSource(ROUTE_SOURCE_ID)) map.removeSource(ROUTE_SOURCE_ID);
        } catch (error) {
            console.error("Erro ao limpar rota:", error);
        }
        routeDataRef.current = null;
        setRouteError(null);
        setAutonomyReport(null);
        setTotalDistance(null);
    }, []);

    /*
    Reseta completamente o estado do mapa
     */
    const forceClearRoute = useCallback((map) => {
        if (!map) return;
        try {
            if (map.getLayer(ROUTE_LAYER_ID)) map.removeLayer(ROUTE_LAYER_ID);
            if (map.getSource(ROUTE_SOURCE_ID)) map.removeSource(ROUTE_SOURCE_ID);
            if (originMarkerRef.current) {
                originMarkerRef.current.remove();
                originMarkerRef.current = null;
            }
            if (destinationMarkerRef.current) {
                destinationMarkerRef.current.remove();
                destinationMarkerRef.current = null;
            }
            setOrigin(null);
            setDestination(null);
            setRouteError(null);
            setAutonomyReport(null);
            setTotalDistance(null);
            setSelectedVehicle(null); // <-- Seu comentário sobre o bug: este código está CORRETO.
            routeDataRef.current = null;
            map.flyTo({ center: [-54, -15], zoom: 1.5 });
            console.log("Mapa resetado para o estado inicial");
        } catch (error) {
            console.error("Erro ao forçar limpeza da rota:", error);
        }
    }, []);

    /*
    useEffect: 'resize' do mapa quando a aba se torna visível
     */
    useEffect(() => {
        // ... (código do resize, sem alterações)
        if (isVisible && mapRef.current) {
            const timer = setTimeout(() => {
                mapRef.current.resize();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [isVisible]);

    /*
     useEffect: Inicializa o mapa MapLibre
     */
    useEffect(() => {
        // ... (código de inicialização do mapa, sem alterações)
        if (mapRef.current) return;
        mapRef.current = new maplibregl.Map({
            container: mapContainerRef.current,
            style: GLOBE_STYLE,
            center: [-54, -15],
            zoom: 1.5,
            projection: 'globe'
        });
        const map = mapRef.current;
        const handleStyleLoad = () => {
            if (routeDataRef.current) {
                setTimeout(() => drawRoute(map, routeDataRef.current), 50);
            }
        };
        const handleZoom = () => {
            const currentZoom = map.getZoom();
            const targetStyle = currentZoom > ZOOM_THRESHOLD ? 'voyager' : 'globe';
            if (targetStyle !== currentStyleRef.current) {
                currentStyleRef.current = targetStyle;
                map.setStyle(targetStyle === 'voyager' ? VOYAGER_STYLE : GLOBE_STYLE);
            }
        };
        map.on('zoom', handleZoom);
        map.on('style.load', handleStyleLoad);
        return () => {
            if (map) {
                map.off('zoom', handleZoom);
                map.off('style.load', handleStyleLoad);
                map.off('error');
                map.remove();
            }
            mapRef.current = null;
        };
    }, [drawRoute]);

    /*
     useEffect: Calcula o relatório de autonomia
     */
    useEffect(() => {
        // ... (código do relatório de autonomia, sem alterações)
        if (totalDistance && selectedVehicle) {
            const distanceInKm = totalDistance / 1000;
            const autonomy = selectedVehicle.autonomiaEstimada;
            const diff = autonomy - distanceInKm;
            if (diff >= 0) {
                setAutonomyReport({
                    status: 'success',
                    message: `Viagem tranquila! Seu ${selectedVehicle.modelo} tem ${diff.toFixed(0)} km de autonomia sobrando.`
                });
            } else {
                setAutonomyReport({
                    status: 'error',
                    message: `Alerta! Faltam ${Math.abs(diff).toFixed(0)} km. A rota exige ${distanceInKm.toFixed(0)} km, mas seu ${selectedVehicle.modelo} tem apenas ${autonomy.toFixed(0)} km.`
                });
            }
        } else {
            setAutonomyReport(null);
        }
    }, [totalDistance, selectedVehicle]);

    /*
    useEffect: Gerencia o marcador de ORIGEM
     */
    useEffect(() => {
        // ... (código do marcador de origem, sem alterações)
        if (!mapRef.current) return;
        const map = mapRef.current;
        if (originMarkerRef.current) originMarkerRef.current.remove();
        if (!origin || isNaN(origin.latitude) || isNaN(origin.longitude)) return;
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.cssText = 'width: 30px; height: 30px; border-radius: 50%; background-color: #22c55e; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3);';
        originMarkerRef.current = new maplibregl.Marker({ element: el })
            .setLngLat([origin.longitude, origin.latitude])
            .setPopup(new maplibregl.Popup({ offset: 25 }).setHTML(`<strong>Origem</strong><br>${origin.displayName}`))
            .addTo(map);
        if (!destination) {
            map.flyTo({ center: [origin.longitude, origin.latitude], zoom: 12, duration: 1500 });
        }
    }, [origin, destination]);

    /*
    useEffect: Gerencia o marcador de DESTINO
     */
    useEffect(() => {
        // ... (código do marcador de destino, sem alterações)
        if (!mapRef.current) return;
        const map = mapRef.current;
        if (destinationMarkerRef.current) destinationMarkerRef.current.remove();
        if (!destination || isNaN(destination.latitude) || isNaN(destination.longitude)) return;
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.cssText = 'width: 30px; height: 30px; border-radius: 50%; background-color: #ef4444; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3);';
        destinationMarkerRef.current = new maplibregl.Marker({ element: el })
            .setLngLat([destination.longitude, destination.latitude])
            .setPopup(new maplibregl.Popup({ offset: 25 }).setHTML(`<strong>Destino</strong><br>${destination.displayName}`))
            .addTo(map);
        if (!origin) {
            map.flyTo({ center: [destination.longitude, destination.latitude], zoom: 12, duration: 1500 });
        }
    }, [destination, origin]);

    /*
     seEffect: Busca e desenha a rota
     */
    useEffect(() => {
        // ... (código de busca de rota, sem alterações)
        if (!mapRef.current) return;
        const map = mapRef.current;
        if (origin && destination) {
            const fetchAndDrawRoute = async () => {
                setIsRouteLoading(true);
                setRouteError(null);
                setTotalDistance(null);
                setAutonomyReport(null);
                try {
                    const cacheKey = getCacheKey(origin, destination);
                    let geoJson;
                    let distance;
                    if (routeCache.has(cacheKey)) {
                        console.log("Usando rota do cache");
                        const cachedData = routeCache.get(cacheKey);
                        geoJson = cachedData.geoJson;
                        distance = cachedData.distance;
                    } else {
                        console.log("Buscando rota da API");
                        const response = await fetchDirectRoute(origin, destination);
                        const { routes } = response.data;
                        if (!routes || routes.length === 0) {
                            throw new Error("Nenhuma rota encontrada.");
                        }
                        const { geometry, distance: routeDistance } = routes[0];
                        distance = routeDistance;
                        const coordinates = polyline.decode(geometry).map(coord => [coord[1], coord[0]]);
                        geoJson = {
                            type: 'Feature',
                            geometry: { type: 'LineString', coordinates }
                        };
                        routeCache.set(cacheKey, { geoJson, distance });
                        console.log("Rota armazenada no cache");
                    }
                    setTotalDistance(distance);
                    routeDataRef.current = geoJson;
                    drawRoute(map, geoJson);
                    const bounds = new maplibregl.LngLatBounds();
                    bounds.extend([origin.longitude, origin.latitude]);
                    bounds.extend([destination.longitude, destination.latitude]);
                    map.fitBounds(bounds, {
                        padding: { top: 50, bottom: 50, left: 50, right: 50 },
                        duration: 1500
                    });
                } catch (error) {
                    console.error("Erro ao buscar rota:", error);
                    setRouteError("Não foi possível calcular a rota. " + (error.response?.data || error.message));
                } finally {
                    setIsRouteLoading(false);
                }
            };
            fetchAndDrawRoute();
        } else {
            clearRoute(map);
        }
    }, [origin, destination, drawRoute, clearRoute]);


    /*
     Define se o botão de "Iniciar Rota" deve estar habilitado
     */
    const canStartTrip = origin &&
        destination &&
        selectedVehicle &&
        totalDistance &&
        autonomyReport &&
        autonomyReport.status === 'success';

    /*
     Handler: Salva a viagem no histórico
     */
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
            console.error("Erro ao salvar viagem (capturado pela AbaMapa):", err);
        } finally {
            setIsSavingTrip(false);
        }
    };

    return (
        <>
            {/* Card de Inputs */}
            <AppCard className="bg-black/20 p-3 rounded-lg w-full text-left mb-2 text-sm space-y-1">
                <h3 className="mb-1">Origem:</h3>
                <AddressSearch
                    placeholder="Endereço de Origem"
                    value={origin}
                    onSelectLocation={setOrigin}
                />
                <h3 className="mb-1">Destino:</h3>
                <AddressSearch
                    placeholder="Endereço de Destino"
                    value={destination}
                    onSelectLocation={setDestination}
                />
                <Label htmlFor="vehicle-select">Veículo para a Rota:</Label>
                <Select
                    value={selectedVehicle ? String(selectedVehicle.id) : undefined}
                    onValueChange={(value) => {
                        const vehicle = meusVeiculos.find(v => v.id === value);
                        setSelectedVehicle(vehicle || null);
                    }}
                    disabled={veiculosLoading}
                >
                    <SelectTrigger
                        id="vehicle-select"
                        className="w-full justify-start text-left p-3 h-9 rounded-lg "
                    >
                        <SelectValue placeholder={veiculosLoading ? "Carregando veículos..." : "Selecione seu veículo..."} />
                    </SelectTrigger>
                    <SelectContent>
                        {!veiculosLoading && meusVeiculos.map(v => (
                            <SelectItem key={v.id} value={String(v.id)}>
                                {v.marca} {v.modelo} (Autonomia: {v.autonomiaEstimada.toFixed(0)} km)
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {isRouteLoading && (
                    <div className="flex items-center justify-center gap-2 p-2 text-azul-claro">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Calculando rota...</span>
                    </div>
                )}
                {routeError && (
                    <div className="flex items-center justify-center gap-2 p-2 text-vermelho-status">
                        <AlertTriangle className="h-4 w-4" />
                        <span>{routeError}</span>
                    </div>
                )}
                {!isRouteLoading && totalDistance && (
                    <div className="flex flex-col items-center justify-center gap-2 p-2 text-texto-claro">
                        <p>Distância Total: <span className="font-bold text-lg">{(totalDistance / 1000).toFixed(2)} km</span></p>
                        {autonomyReport && (
                            <div className={`flex items-center gap-2 p-2 rounded-md w-full justify-center ${
                                autonomyReport.status === 'success'
                                    ? 'bg-verde-claro/10 text-verde-claro'
                                    : 'bg-vermelho-status/10 text-vermelho-status'
                            }`}>
                                {autonomyReport.status === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                                <span className="text-xs text-center">{autonomyReport.message}</span>
                            </div>
                        )}
                    </div>
                )}
                {!isRouteLoading && totalDistance && (
                    <Button
                        variant={canStartTrip ? "botaoazul" : "ghost"}
                        disabled={!canStartTrip || isSavingTrip}
                        onClick={handleIniciarRota}
                        className="w-full mt-2"
                    >
                        {isSavingTrip ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Rocket className="h-4 w-4" />
                        )}
                        <span>{isSavingTrip ? "Salvando..." : "Iniciar Rota e Salvar"}</span>
                    </Button>
                )}
                <Button variant="ghost" onClick={() => forceClearRoute(mapRef.current)}>Limpar Rota</Button>
            </AppCard>

            {/* container do Mapa */}
            <div
                ref={mapContainerRef}
                id="map"
                style={{ width: '100%', height: '400px' }}
                className="rounded-xl"
            />
        </>
    );
}