import axios from 'axios';
import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use((config) => {
    // Verifica se estamos no navegador
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('e-move-token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const fetchDirectRoute = async (origin, destination) => {
    const coords = {
        latOrigem: origin.latitude,
        longiOrigem: origin.longitude,
        latDestino: destination.latitude,
        longiDestino: destination.longitude
    };
    return api.post('/mapa/rota', coords);
};

export const buscarEstacoesProximas = async (lat, lon, raioKm = 20) => {
    return api.get(`/estacoes/proximas?latitude=${lat}&longitude=${lon}&raio=${raioKm}`);
};

export const geocodeAddress = async (address) => {
    return api.get(`/mapa/geocode?q=${encodeURIComponent(address)}`);
};

export const consultarViagem = async (inicio, fim) => {
    const params = {};
    if (inicio) params.inicio = inicio;
    if (fim) params.fim = fim;
    return api.get('/viagens', { params });
};

export const salvarViagem = async (dadosViagem) => {
    return api.post('/viagens', dadosViagem);
};

export const atualizarViagem = async (id, dados) => {
    return api.put(`/viagens/${id}`, dados);
};

export const getEstacoesFavoritas = async () => {
    return api.get('/estacoes/favoritas');
};

export const favoritarEstacao = async (stationId) => {
    return api.post(`/estacoes/${stationId}/favoritar`);
};

export const desfavoritarEstacao = async (stationId) => {
    return api.delete(`/estacoes/${stationId}/favoritar`);
};

export default api;