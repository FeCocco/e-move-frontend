import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true,
});

/**
 * Busca a rota direta entre dois pontos
 * @param {object} origin { latitude, longitude }
 * @param {object} destination { latitude, longitude }
 * @returns {Promise<object>} A resposta da API de direções
 */
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

export default api;