"use client";

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { consultarViagem, salvarViagem as apiSalvarViagem } from '@/lib/api';
import { toast } from 'sonner';

const ViagensContext = createContext(null);

export function ViagensProvider({ children }) {

    // --- Lógica movida da AbaRotas ---
    const [historicoRotas, setHistoricoRotas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchHistorico = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await consultarViagem();
            setHistoricoRotas(response.data);
        } catch (err) {
            setError("Não foi possível carregar o histórico de rotas.");
            console.error("Erro ao buscar histórico:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    // --- Roda na inicialização ---
    useEffect(() => {
        fetchHistorico();
    }, [fetchHistorico]);

    /*
     função que será chamada pela AbaMapa
     salva a viagem E ATUALIZA o histórico
     */
    const salvarViagem = async (viagemData) => {
        try {
            // 1. Chama a API para salvar
            await apiSalvarViagem(viagemData);
            toast.success('Viagem iniciada!', {
                description: 'Sua rota foi salva no histórico.'
            });
            await fetchHistorico();

        } catch (err) {
            console.error("Erro ao salvar viagem:", err);
            toast.error('Erro!', { description: err.response?.data || 'Não foi possível salvar a rota.' });

            throw err;
        }
    };

    const value = {
        historicoRotas,
        loading,
        error,
        salvarViagem,
        refetchHistorico: fetchHistorico // se precisarmos de um refresh manual
    };

    return (
        <ViagensContext.Provider value={value}>
            {children}
        </ViagensContext.Provider>
    );
}

export function useViagens() {
    const context = useContext(ViagensContext);
    if (!context) {
        throw new Error('useViagens deve ser usado dentro de um ViagensProvider');
    }
    return context;
}