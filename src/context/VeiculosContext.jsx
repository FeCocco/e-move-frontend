"use client";

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';

const VeiculosContext = createContext(null);

export function VeiculosProvider({ children }) {
    const [meusVeiculos, setMeusVeiculos] = useState([]);
    const [todosVeiculos, setTodosVeiculos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMeusVeiculos = useCallback(async () => {
        try {
            const response = await api.get('/veiculos/meus-veiculos');
            setMeusVeiculos(response.data);
        } catch (err) {
            console.error("Erro ao buscar meus veículos:", err);
            setError('Não foi possível carregar seus veículos.');
        }
    }, []);

    const fetchTodosVeiculos = useCallback(async () => {
        try {
            const response = await api.get('/veiculos');
            setTodosVeiculos(response.data);
        } catch (err) {
            console.error("Erro ao buscar todos os veículos:", err);
            setError('Não foi possível carregar a lista de veículos disponíveis.');
        }
    }, []);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);
            await Promise.all([fetchMeusVeiculos(), fetchTodosVeiculos()]);
            setLoading(false);
        };
        loadData();
    }, [fetchMeusVeiculos, fetchTodosVeiculos]);

    const adicionarVeiculo = async (veiculoId) => {
        try {
            await api.post(`/veiculos/meus-veiculos/${veiculoId}`);
            toast.success('Sucesso!', { description: 'Veículo adicionado à sua garagem.' });
            await fetchMeusVeiculos(); // Re-busca a lista ATUALIZADA
        } catch (err) {
            console.error("Erro ao adicionar veículo:", err);
            toast.error('Erro!', { description: err.response?.data || 'Não foi possível adicionar o veículo.' });
        }
    };

    const removerVeiculo = async (veiculoId) => {
        try {
            await api.delete(`/veiculos/meus-veiculos/${veiculoId}`);
            toast.success('Sucesso!', { description: 'Veículo removido da sua garagem.' });
            await fetchMeusVeiculos(); // Re-busca a lista ATUALIZADA
        } catch (err) {
            console.error("Erro ao remover veículo:", err);
            toast.error('Erro!', { description: err.response?.data || 'Não foi possível remover o veículo.' });
        }
    };

    const atualizarNivelBateria = async (veiculoId, nivelBateria) => {
        try {
            await api.put(`/veiculos/${veiculoId}/bateria`, { nivelBateria });
            toast.success('Sucesso!', { description: 'Nível da bateria atualizado.' });
            await fetchMeusVeiculos(); // Re-busca a lista ATUALIZADA
        } catch (err) {
            console.error("Erro ao atualizar bateria:", err);
            toast.error('Erro!', { description: err.response?.data || 'Não foi possível atualizar a bateria.' });
        }
    };

    const value = {
        meusVeiculos,
        todosVeiculos,
        loading,
        error,
        adicionarVeiculo,
        removerVeiculo,
        atualizarNivelBateria
    };

    return (
        <VeiculosContext.Provider value={value}>
            {children}
        </VeiculosContext.Provider>
    );
}

export function useVeiculos() {
    const context = useContext(VeiculosContext);
    if (!context) {
        throw new Error('useVeiculos deve ser usado dentro de um VeiculosProvider');
    }
    return context;
}