"use client";
import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {Input} from "@/components/ui/input";
import {AppCard} from "@/components/AppCard/AppCard";

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

    useEffect(() => {
        // evita a reinicialização do mapa se ele já existir
        if (mapRef.current) return;

        mapRef.current = new maplibregl.Map({
            container: mapContainerRef.current, // usa a referencia do container
            style: GLOBE_STYLE,
            center: [-54, -15], // centraliuzado no brasil
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

        // funçao de limpeza
        return () => {
            map.off('zoom', handleZoom);
            map.remove();
            mapRef.current = null;
        };
    }, []);

    return (
        <>
            <p>Conteúdo de Planejar Rota...</p>
                <AppCard className="bg-black/20 p-6 rounded-lg w-full text-left mb-8">
                    <h3>Origem:</h3>
                    <Input placeholder="ENdereço de Origem" className="mb-4"/>

                    <h3>Destino:</h3>
                    <Input placeholder="Endereço de Destino" className="mb-4"/>
                </AppCard>

                <div ref={mapContainerRef} id="map" style={{ width: '100%', height: '400px' }} className="rounded-xl"/>

        </>
    );
}