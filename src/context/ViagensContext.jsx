"use client";

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { consultarViagem, salvarViagem as apiSalvarViagem, atualizarViagem } from '@/lib/api';
import { toast } from 'sonner';

const ViagensContext = createContext(null);

export function ViagensProvider({ children }) {

    const [historicoRotas, setHistoricoRotas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Estado de Ponte entre Rotas e Mapa ---
    const [rotaParaCarregar, setRotaParaCarregar] = useState(null);

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

    useEffect(() => {
        fetchHistorico();
    }, [fetchHistorico]);

    const salvarViagem = async (viagemData) => {
        try {
            await apiSalvarViagem(viagemData);
            toast.success('Viagem iniciada!', {
                description: 'Sua rota foi salva no histórico.'
            });
            await fetchHistorico();
        } catch (err) {
            console.error("Erro ao salvar viagem:", err);
            toast.error('Erro!', {description: err.response?.data || 'Não foi possível salvar a rota.'});
            throw err;
        }
    };

    const toggleFavorito = async (viagemId, favorita, apelido) => {
        try {
            await atualizarViagem(viagemId, { favorita, apelido });

            setHistoricoRotas(prevRotas =>
                prevRotas.map(rota => rota.id_viagem === viagemId
                        ? { ...rota, favorita, apelido }
                        : rota
                )
            );

            toast.success(favorita ? 'Adicionado aos favoritos!' : 'Removido dos favoritos.');

        } catch (err) {
            console.error("Erro ao atualizar favorito:", err);
            toast.error("Não foi possível atualizar a rota.");
        }
    };

    const value = {
        historicoRotas,
        loading,
        error,
        salvarViagem,
        toggleFavorito,
        refetchHistorico: fetchHistorico,
        rotaParaCarregar,    // Exportado
        setRotaParaCarregar  // Exportado
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