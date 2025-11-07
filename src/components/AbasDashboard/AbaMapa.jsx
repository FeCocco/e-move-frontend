"use client";
import { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { AppCard } from "@/components/AppCard/AppCard";
import { AddressSearch } from "@/components/AddressSearch";
import { fetchDirectRoute } from "@/lib/api";
import polyline from '@mapbox/polyline';
import { Loader2, AlertTriangle } from 'lucide-react';

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
    // Refs para mapa e marcadores
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const currentStyleRef = useRef('globe');
    const originMarkerRef = useRef(null);
    const destinationMarkerRef = useRef(null);

    // Ref para armazenar dados da rota atual
    const routeDataRef = useRef(null);

    // Estados principais
    const [origin, setOrigin] = useState(null);
    const [destination, setDestination] = useState(null);
    const [isRouteLoading, setIsRouteLoading] = useState(false);
    const [routeError, setRouteError] = useState(null);

    const drawRoute = useCallback((map, geoJson) => {
        if (!map || !geoJson) return;

        const attemptDraw = () => {
            if (!map.isStyleLoaded()) return false;

            try {
                if (map.getLayer(ROUTE_LAYER_ID)) map.removeLayer(ROUTE_LAYER_ID);
                if (map.getSource(ROUTE_SOURCE_ID)) map.removeSource(ROUTE_SOURCE_ID);

                map.addSource(ROUTE_SOURCE_ID, {
                    type: 'geojson',
                    data: geoJson
                });

                map.addLayer({
                    id: ROUTE_LAYER_ID,
                    type: 'line',
                    source: ROUTE_SOURCE_ID,
                    layout: {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    paint: {
                        'line-color': '#00BFFF',
                        'line-width': [
                            'interpolate',
                            ['exponential', 1.5],
                            ['zoom'],
                            0, 2,
                            5, 4,
                            10, 6,
                            15, 8
                        ],
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

    const clearRoute = useCallback((map) => {
        if (!map) return;

        try {
            if (map.getLayer(ROUTE_LAYER_ID)) map.removeLayer(ROUTE_LAYER_ID);
            if (map.getSource(ROUTE_SOURCE_ID)) map.removeSource(ROUTE_SOURCE_ID);
        } catch (error) {
            console.error("Erro ao limpar rota:", error);
        }

        routeDataRef.current = null;
        setRouteError(null);
    }, []);

    useEffect(() => {
        if (isVisible && mapRef.current) {
            const timer = setTimeout(() => {
                mapRef.current.resize();
            }, 100); // 100ms é geralmente seguro

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

        map.on('error', (e) => {
            const msg = e.error?.message || '';
            if (msg.includes('glyphs') || msg.includes('pbf') || msg.includes('font')) {
                e.preventDefault?.();
                return;
            }
            console.error('Erro no mapa:', e);
        });

        const handleStyleLoad = () => {
            if (routeDataRef.current) {
                setTimeout(() => drawRoute(map, routeDataRef.current), 50);
                setTimeout(() => drawRoute(map, routeDataRef.current), 200);
                setTimeout(() => drawRoute(map, routeDataRef.current), 500);
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

    // Marcador de origem
    useEffect(() => {
        if (!mapRef.current) return;
        const map = mapRef.current;

        if (originMarkerRef.current) originMarkerRef.current.remove();

        if (origin) {
            const el = document.createElement('div');
            el.className = 'marker';
            el.style.width = '30px';
            el.style.height = '30px';
            el.style.borderRadius = '50%';
            el.style.backgroundColor = '#22c55e';
            el.style.border = '3px solid white';
            el.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';

            originMarkerRef.current = new maplibregl.Marker({ element: el })
                .setLngLat([origin.longitude, origin.latitude])
                .setPopup(new maplibregl.Popup({ offset: 25 }).setHTML(`<strong>Origem</strong><br>${origin.displayName}`))
                .addTo(map);

            if (!destination) {
                map.flyTo({
                    center: [origin.longitude, origin.latitude],
                    zoom: 12,
                    duration: 1500
                });
            }
        }
    }, [origin, destination]);

    // Marcador de destino
    useEffect(() => {
        if (!mapRef.current) return;
        const map = mapRef.current;

        if (destinationMarkerRef.current) destinationMarkerRef.current.remove();

        if (destination) {
            const el = document.createElement('div');
            el.className = 'marker';
            el.style.width = '30px';
            el.style.height = '30px';
            el.style.borderRadius = '50%';
            el.style.backgroundColor = '#ef4444';
            el.style.border = '3px solid white';
            el.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';

            destinationMarkerRef.current = new maplibregl.Marker({ element: el })
                .setLngLat([destination.longitude, destination.latitude])
                .setPopup(new maplibregl.Popup({ offset: 25 }).setHTML(`<strong>Destino</strong><br>${destination.displayName}`))
                .addTo(map);

            if (!origin) {
                map.flyTo({
                    center: [destination.longitude, destination.latitude],
                    zoom: 12,
                    duration: 1500
                });
            }
        }
    }, [destination, origin]);

    // Busca e desenha a rota (com cache)
    useEffect(() => {
        if (!mapRef.current) return;
        const map = mapRef.current;

        if (origin && destination) {
            const fetchAndDrawRoute = async () => {
                setIsRouteLoading(true);
                setRouteError(null);

                try {
                    const cacheKey = getCacheKey(origin, destination);
                    let geoJson;

                    if (routeCache.has(cacheKey)) {
                        console.log("Usando rota do cache");
                        geoJson = routeCache.get(cacheKey);
                    } else {
                        console.log("Buscando rota da API");
                        const response = await fetchDirectRoute(origin, destination);
                        const { routes } = response.data;

                        if (!routes || routes.length === 0) {
                            throw new Error("Nenhuma rota encontrada.");
                        }

                        const { geometry } = routes[0];
                        const coordinates = polyline.decode(geometry).map(coord => [coord[1], coord[0]]);

                        geoJson = {
                            type: 'Feature',
                            geometry: {
                                type: 'LineString',
                                coordinates
                            }
                        };

                        routeCache.set(cacheKey, geoJson);
                        console.log("Rota armazenada no cache");
                    }

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

    return (
        <>
            <AppCard className="bg-black/20 p-3 rounded-lg w-full text-left mb-4 text-sm space-y-3">
                <h3 className="mb-2">Origem:</h3>
                <AddressSearch
                    placeholder="Endereço de Origem"
                    onSelectLocation={setOrigin}
                />

                <h3 className="mb-2 mt-6">Destino:</h3>
                <AddressSearch
                    placeholder="Endereço de Destino"
                    onSelectLocation={setDestination}
                />

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
            </AppCard>

            <div
                ref={mapContainerRef}
                id="map"
                style={{ width: '100%', height: '400px' }}
                className="rounded-xl"
            />
        </>
    );
}