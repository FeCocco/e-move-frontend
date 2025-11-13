import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Forward Geocoding - Convert address to coordinates
 * @param {string} address - The address to geocode
 * @returns {Promise<Array>} Array of location results
 */
export async function forwardGeocode(address) {
    try {
        const response = await axios.get(`${API_BASE_URL}/forward-geocoding`, {
            params: { address }
        });
        return response.data;
    } catch (error) {
        console.error('Error in forward geocoding:', error);
        throw error;
    }
}