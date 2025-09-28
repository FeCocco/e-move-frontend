import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';

export function useVeiculos() {
    const [meusVeiculos, setMeusVeiculos] = useState([]);
    const [todosVeiculos, setTodosVeiculos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Esta função agora será nossa única fonte de verdade para os veículos do usuário
    const fetchMeusVeiculos = useCallback(async () => {
        try {
            const response = await api.get('/api/veiculos/meus-veiculos');
            setMeusVeiculos(response.data);
        } catch (err) {
            console.error("Erro ao buscar meus veículos:", err);
            setError('Não foi possível carregar seus veículos.');
            // A notificação de erro já acontece aqui, não precisa repetir nas outras funções
        }
    }, []);

    const fetchTodosVeiculos = useCallback(async () => {
        try {
            const response = await api.get('/api/veiculos');
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
            // 1. Faz a chamada à API para adicionar
            await api.post(`/api/veiculos/meus-veiculos/${veiculoId}`);
            toast.success('Sucesso!', { description: 'Veículo adicionado à sua garagem.' });
            // 2. [A MUDANÇA] Busca a lista atualizada do servidor
            await fetchMeusVeiculos();
        } catch (err) {
            console.error("Erro ao adicionar veículo:", err);
            toast.error('Erro!', { description: err.response?.data || 'Não foi possível adicionar o veículo.' });
        }
    };

    const removerVeiculo = async (veiculoId) => {
        try {
            // 1. Faz a chamada à API para remover
            await api.delete(`/api/veiculos/meus-veiculos/${veiculoId}`);
            toast.success('Sucesso!', { description: 'Veículo removido da sua garagem.' });
            // 2. [A MUDANÇA] Busca a lista atualizada do servidor
            await fetchMeusVeiculos();
        } catch (err) {
            console.error("Erro ao remover veículo:", err);
            toast.error('Erro!', { description: err.response?.data || 'Não foi possível remover o veículo.' });
        }
    };

    const atualizarNivelBateria = async (veiculoId, nivelBateria) => {
        try {
            // 1. Faz a chamada à API para atualizar
            await api.put(`/api/veiculos/${veiculoId}/bateria`, { nivelBateria });
            toast.success('Sucesso!', { description: 'Nível da bateria atualizado.' });
            // 2. [A MUDANÇA] Busca a lista atualizada para refletir a nova autonomia estimada
            await fetchMeusVeiculos();
        } catch (err) {
            console.error("Erro ao atualizar bateria:", err);
            toast.error('Erro!', { description: err.response?.data || 'Não foi possível atualizar a bateria.' });
        }
    };

    return {
        meusVeiculos,
        todosVeiculos,
        loading,
        error,
        adicionarVeiculo,
        removerVeiculo,
        atualizarNivelBateria
    };
}