"use client";
import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { AppCard } from "@/components/AppCard/AppCard";
import { AddressSearch } from "@/components/AddressSearch";

// estilos como constantes
const GLOBE_STYLE = 'https://demotiles.maplibre.org/globe.json';
const VOYAGER_STYLE = 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json';

// nuivel de zoom da troca
const ZOOM_THRESHOLD = 4;

export default function AbaMapa() {
    // useRef para manter a instância do mapa e o estilo atual
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const currentStyleRef = useRef('globe'); // começa com 'globe'
    const originMarkerRef = useRef(null);
    const destinationMarkerRef = useRef(null);

    // Estados para origem e destino
    const [origin, setOrigin] = useState(null);
    const [destination, setDestination] = useState(null);

    useEffect(() => {
        // evita a reinicialização do mapa se ele já existir
        if (mapRef.current) return;

        mapRef.current = new maplibregl.Map({
            container: mapContainerRef.current, // usa a referencia do container
            style: GLOBE_STYLE,
            center: [-54, -15], // centralizado no brasil
            zoom: 1.5
        });

        const map = mapRef.current;

        const handleZoom = () => {
            const currentZoom = map.getZoom();

            // quais estilo devem ser exibidos com base no zoom
            const targetStyle = currentZoom >= ZOOM_THRESHOLD ? 'voyager' : 'globe';

            // so troca o estilo se o alvo for diferente do atual, para evitar recargas desnecessárias
            if (targetStyle !== currentStyleRef.current) {
                if (targetStyle === 'voyager') {
                    map.setStyle(VOYAGER_STYLE);
                    currentStyleRef.current = 'voyager';
                } else {
                    map.setStyle(GLOBE_STYLE);
                    currentStyleRef.current = 'globe';
                }
            }
        };

        map.on('zoom', handleZoom);

        // função de limpeza
        return () => {
            map.off('zoom', handleZoom);
            map.remove();
            mapRef.current = null;
        };
    }, []);

    // Atualizar marcador de origem no mapa
    useEffect(() => {
        if (!mapRef.current || !origin) return;

        const map = mapRef.current;

        // Remove marcador anterior se existir
        if (originMarkerRef.current) {
            originMarkerRef.current.remove();
        }

        // Cria novo marcador verde para origem
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
            .setPopup(
                new maplibregl.Popup({ offset: 25 })
                    .setHTML(`<strong>Origem</strong><br>${origin.displayName}`)
            )
            .addTo(map);

        // Centraliza o mapa na origem
        map.flyTo({
            center: [origin.longitude, origin.latitude],
            zoom: 12,
            duration: 1500
        });
    }, [origin]);

    // Atualizar marcador de destino no mapa
    useEffect(() => {
        if (!mapRef.current || !destination) return;

        const map = mapRef.current;

        // Remove marcador anterior se existir
        if (destinationMarkerRef.current) {
            destinationMarkerRef.current.remove();
        }

        // Cria novo marcador vermelho para destino
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
            .setPopup(
                new maplibregl.Popup({ offset: 25 })
                    .setHTML(`<strong>Destino</strong><br>${destination.displayName}`)
            )
            .addTo(map);

        // Se ambos os pontos existirem, ajusta o zoom para mostrar os dois
        if (origin && destination) {
            const bounds = new maplibregl.LngLatBounds();
            bounds.extend([origin.longitude, origin.latitude]);
            bounds.extend([destination.longitude, destination.latitude]);
            
            map.fitBounds(bounds, {
                padding: 100,
                duration: 1500
            });
        } else {
            // Centraliza apenas no destino
            map.flyTo({
                center: [destination.longitude, destination.latitude],
                zoom: 12,
                duration: 1500
            });
        }
    }, [destination, origin]);

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