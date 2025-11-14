import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true,
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

export const consultarViagem = () => {
    return api.get('/api/viagens');
}

export default api;