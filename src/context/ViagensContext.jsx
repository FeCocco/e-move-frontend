"use client";

import { useState, useEffect, useCallback, createContext, useContext, useMemo } from 'react';
import { consultarViagem, salvarViagem as apiSalvarViagem, atualizarViagem } from '@/lib/api';
import { toast } from 'sonner';

const ViagensContext = createContext(null);

export function ViagensProvider({ children }) {

    const [historicoRotas, setHistoricoRotas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rotaParaCarregar, setRotaParaCarregar] = useState(null);

    // --- CÁLCULO DE ESTATÍSTICAS REAIS ---
    const estatisticas = useMemo(() => {
        if (!historicoRotas || historicoRotas.length === 0) {
            return {
                totalDistancia: 0,
                totalCO2: 0,
                totalEnergia: 0,
                veiculosRanking: [],
                evolucaoMensal: [] // Novo dado
            };
        }

        let dist = 0;
        let co2 = 0;
        const veiculoCount = {};
        const mesesMap = {};

        // Processa cada rota
        historicoRotas.forEach(rota => {
            // Somas totais
            dist += rota.kmTotal || 0;
            co2 += rota.co2Preservado || 0;

            // Ranking de Veículos
            if (rota.veiculo) {
                const nomeVeiculo = `${rota.veiculo.marca} ${rota.veiculo.modelo}`;
                veiculoCount[nomeVeiculo] = (veiculoCount[nomeVeiculo] || 0) + 1;
            }

            // Agrupamento por Mês para o Gráfico de Evolução
            if (rota.dtViagem) {
                const data = new Date(rota.dtViagem);

                const diaFormatado = data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

                if (!mesesMap[diaFormatado]) {
                    mesesMap[diaFormatado] = { mes: diaFormatado, km: 0, co2: 0, ordem: data.getTime() };
                }
                mesesMap[diaFormatado].km += rota.kmTotal || 0;
                mesesMap[diaFormatado].co2 += rota.co2Preservado || 0;
            }
        });

        // Formata Ranking Veículos
        const ranking = Object.entries(veiculoCount)
            .map(([veiculo, uso]) => ({ veiculo, uso }))
            .sort((a, b) => b.uso - a.uso)
            .slice(0, 5);

        // Formata Evolução Mensal (Ordenado por data)
        const evolucao = Object.values(mesesMap)
            .sort((a, b) => a.ordem - b.ordem)
            .map(({ mes, km, co2 }) => ({ mes, km: Math.round(km), co2: Number(co2.toFixed(1)) }));

        // Se tiver menos de 2 meses, adiciona um placeholder para o gráfico não quebrar
        if (evolucao.length === 0) {
            evolucao.push({ mes: 'Atual', km: 0, co2: 0 });
        }

        return {
            totalDistancia: dist,
            totalCO2: co2,
            totalEnergia: dist * 0.18, // Estimativa 0.18 kWh/km
            veiculosRanking: ranking,
            evolucaoMensal: evolucao
        };
    }, [historicoRotas]);

    const fetchHistorico = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await consultarViagem();
            setHistoricoRotas(response.data);
        } catch (err) {
            console.error("Erro ao buscar histórico:", err);
            // Não setamos erro crítico aqui para não travar o dashboard inteiro se falhar
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
            toast.success('Viagem iniciada!', { description: 'Sua rota foi salva no histórico.' });
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
                prevRotas.map(rota =>
                    rota.id_viagem === viagemId ? { ...rota, favorita, apelido } : rota
                )
            );
            toast.success(favorita ? 'Adicionado aos favoritos!' : 'Removido dos favoritos.');
        } catch (err) {
            console.error("Erro ao atualizar favorito:", err);
            toast.error("Não foi possível atualizar a rota.");
        }
    };

    const value = {
        historicoRotas, loading, error,
        salvarViagem, toggleFavorito, refetchHistorico: fetchHistorico,
        rotaParaCarregar, setRotaParaCarregar,
        estatisticas // Exportando estatísticas completas
    };

    return (
        <ViagensContext.Provider value={value}>
            {children}
        </ViagensContext.Provider>
    );
}

export function useViagens() {
    const context = useContext(ViagensContext);
    if (!context) throw new Error('useViagens deve ser usado dentro de um ViagensProvider');
    return context;
}