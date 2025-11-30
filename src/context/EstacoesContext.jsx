"use client";
import {createContext, useCallback, useContext, useEffect, useState} from 'react';
import {desfavoritarEstacao, favoritarEstacao, getEstacoesFavoritas} from '@/lib/api';
import {toast} from 'sonner';

const EstacoesContext = createContext(null);

export function EstacoesProvider({ children }) {
    const [favoritas, setFavoritas] = useState([]); // Lista de objetos StationDTO completos
    const [loading, setLoading] = useState(true);

    const fetchFavoritas = useCallback(async () => {
        try {
            const res = await getEstacoesFavoritas();
            setFavoritas(res.data);
        } catch (error) {
            console.error("Erro ao buscar favoritas", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchFavoritas(); }, [fetchFavoritas]);

    const toggleFavorita = async (estacao) => {
        const isFav = favoritas.some(f => f.ID === estacao.ID);
        try {
            if (isFav) {
                await desfavoritarEstacao(estacao.ID);
                setFavoritas(prev => prev.filter(f => f.ID !== estacao.ID));
                toast.success("Estação removida dos favoritos.");
            } else {
                await favoritarEstacao(estacao.ID);
                setFavoritas(prev => [...prev, estacao]);
                toast.success("Estação favoritada!");
            }
        } catch (error) {
            toast.error("Erro ao atualizar favorito.");
        }
    };

    const isFavorita = (id) => favoritas.some(f => f.ID === id);

    return (
        <EstacoesContext.Provider value={{ favoritas, loading, toggleFavorita, isFavorita }}>
            {children}
        </EstacoesContext.Provider>
    );
}

export const useEstacoes = () => {
    return useContext(EstacoesContext);
};