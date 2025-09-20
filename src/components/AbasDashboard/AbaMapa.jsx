"use client";
import { useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function AbaMapa() {
    useEffect(() => {
        const map = new maplibregl.Map({
            container: 'map', // container id
            style: 'https://demotiles.maplibre.org/style.json',
            center: [0, 0],
            zoom: 1
        });

        return () => map.remove(); // remove o mapa ao desmontar o componente
    }, []);

    return (
        <>
            <p>Conteúdo de Planejar Rota...</p>
            <div>
                <div id="map" style={{ width: '100%', height: '400px' }} />
            </div>
        </>
    );
}
