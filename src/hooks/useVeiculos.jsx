import { useState, useEffect, useCallback } from 'react';
import { getApiErrorMessage } from '@/lib/errorHandler';

const API_URL = 'http://localhost:8080/api/veiculos';

export function useVeiculos() {
    const [meusVeiculos, setMeusVeiculos] = useState([]);
    const [todosVeiculos, setTodosVeiculos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchMeusVeiculos = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/meus-veiculos`, {
                credentials: 'include',
            });
            if (!response.ok) throw new Error(await response.text());
            const data = await response.json();
            setMeusVeiculos(data);
        } catch (err) {
            setError(getApiErrorMessage(err.message));
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchTodosVeiculos = useCallback(async () => {
        try {
            const response = await fetch(API_URL, { credentials: 'include' });
            if (!response.ok) throw new Error(await response.text());
            const data = await response.json();
            setTodosVeiculos(data);
        } catch (err) {
            setError(getApiErrorMessage(err.message));
        }
    }, []);

    useEffect(() => {
        fetchMeusVeiculos();
        fetchTodosVeiculos();
    }, [fetchMeusVeiculos, fetchTodosVeiculos]);

    const adicionarVeiculo = async (veiculoId) => {
        try {
            const response = await fetch(`${API_URL}/meus-veiculos/${veiculoId}`, {
                method: 'POST',
                credentials: 'include',
            });
            if (!response.ok) throw new Error(await response.text());
            const data = await response.json();
            setMeusVeiculos(data);
        } catch (err) {
            setError(getApiErrorMessage(err.message));
        }
    };

    const removerVeiculo = async (veiculoId) => {
        try {
            const response = await fetch(`${API_URL}/meus-veiculos/${veiculoId}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (!response.ok) throw new Error(await response.text());
            const data = await response.json();
            setMeusVeiculos(data);
        } catch (err) {
            setError(getApiErrorMessage(err.message));
        }
    };

    const atualizarNivelBateria = async (veiculoId, nivelBateria) => {
        try {
            const response = await fetch(`${API_URL}/${veiculoId}/bateria`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ nivelBateria }),
            });
            if (!response.ok) throw new Error(await response.text());
            // Atualiza a lista de veículos para refletir a mudança
            await fetchMeusVeiculos();
        } catch (err) {
            setError(getApiErrorMessage(err.message));
            throw err; // Lança o erro para que o componente possa tratá-lo
        }
    };

    return { meusVeiculos, todosVeiculos, loading, error, adicionarVeiculo, removerVeiculo, atualizarNivelBateria };
}