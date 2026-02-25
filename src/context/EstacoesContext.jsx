"use client";
import { createContext, useCallback, useContext, useState, useRef } from 'react';
import { desfavoritarEstacao, favoritarEstacao, getEstacoesFavoritas } from '@/lib/api';
import { toast } from 'sonner';

const EstacoesContext = createContext(null);


    export function EstacoesProvider({ children }) {
        const [favoritas, setFavoritas] = useState([]);
        const [loading, setLoading] = useState(false);

        const hasFetched = useRef(false);

        const fetchFavoritas = useCallback(async (maxTentativas = 2) => {
            if (hasFetched.current) return;

            setLoading(true);
            let tentativaAtual = 0;

            while (tentativaAtual <= maxTentativas) {
                try {
                    const res = await getEstacoesFavoritas();
                    setFavoritas(res.data);

                    hasFetched.current = true;

                    setLoading(false);
                    return;

                } catch (error) {
                    tentativaAtual++;
                    console.warn(`⏳ Falha ao buscar estações. Tentativa ${tentativaAtual} de ${maxTentativas + 1}...`);

                    if (tentativaAtual > maxTentativas) {
                        console.error("❌ Erro definitivo ao buscar favoritas:", error);
                        toast.error("Não foi possível carregar as estações. Tente recarregar a página.");
                        break;
                    }

                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
            }

            setLoading(false);
        }, []);

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
        <EstacoesContext.Provider
            value={{
                favoritas,
                loading,
                toggleFavorita,
                isFavorita,
                refetchFavoritas: fetchFavoritas,
            }}
        >
            {children}
        </EstacoesContext.Provider>
    );
}

export const useEstacoes = () => {
    return useContext(EstacoesContext);
};