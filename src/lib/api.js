import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080',
});

api.interceptors.request.use((config) => {
    // Tenta pegar o token do storage
    const token = typeof window !== 'undefined' ? localStorage.getItem('emove_token') : null;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

export const fetchDirectRoute = (origin, destination) => {
    return api.get('/api/directions', {
        params: {
            oLat: origin.latitude,
            oLon: origin.longitude,
            dLat: destination.latitude,
            dLon: destination.longitude,
        }
    });
};

export const salvarViagem = (viagemData) => {
    return api.post('/api/viagens', viagemData);
};

export const consultarViagem = (inicio, fim) => {
    // Se tiver datas, adiciona como query params
    const params = {};
    if (inicio) params.inicio = inicio; // YYYY-MM-DD
    if (fim) params.fim = fim;

    return api.get('/api/viagens', { params });
};

export const atualizarViagem = (viagemId, dados) => {
    return api.patch(`/api/viagens/${viagemId}`, dados);
};

export const buscarEstacoesProximas = async (lat, lon, raio = 50) => { // Raio padrão 50, mas aceita dinâmico
    try {
        return await api.get('/api/estacoes/proximas', {
            params: {lat, lon, raio} // Passa o raio calculado pelo algoritmo
        });
    } catch (error) {
        console.error("Erro ao buscar estações:", error);
        return { data: [] };
    }
};

export const getEstacoesFavoritas = () => api.get('/api/estacoes/favoritas');
export const favoritarEstacao = (id) => api.post(`/api/estacoes/${id}/favorito`);
export const desfavoritarEstacao = (id) => api.delete(`/api/estacoes/${id}/favorito`);

export default api;