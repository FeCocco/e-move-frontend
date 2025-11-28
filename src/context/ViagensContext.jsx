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

    // --- NOVOS ESTADOS PARA FILTRO ---
    const [dataInicio, setDataInicio] = useState(null);
    const [dataFim, setDataFim] = useState(null);

    const estatisticas = useMemo(() => {
        if (!historicoRotas || historicoRotas.length === 0) {
            return { totalDistancia: 0, totalCO2: 0, totalEnergia: 0, veiculosRanking: [], evolucaoMensal: [] };
        }

        let dist = 0;
        let co2 = 0;
        const veiculoCount = {};
        const mesesMap = {};

        historicoRotas.forEach(rota => {
            dist += rota.kmTotal || 0;
            co2 += rota.co2Preservado || 0;

            if (rota.veiculo) {
                const nomeVeiculo = `${rota.veiculo.marca} ${rota.veiculo.modelo}`;
                veiculoCount[nomeVeiculo] = (veiculoCount[nomeVeiculo] || 0) + 1;
            }

            if (rota.dtViagem) {
                const data = new Date(rota.dtViagem);
                // Agrupa por dia/mês para o gráfico
                const diaFormatado = data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

                if (!mesesMap[diaFormatado]) {
                    mesesMap[diaFormatado] = { mes: diaFormatado, km: 0, co2: 0, ordem: data.getTime() };
                }
                mesesMap[diaFormatado].km += rota.kmTotal || 0;
                mesesMap[diaFormatado].co2 += rota.co2Preservado || 0;
            }
        });

        const ranking = Object.entries(veiculoCount)
            .map(([veiculo, uso]) => ({ veiculo, uso }))
            .sort((a, b) => b.uso - a.uso)
            .slice(0, 5);

        const evolucao = Object.values(mesesMap)
            .sort((a, b) => a.ordem - b.ordem)
            .map(({ mes, km, co2 }) => ({ mes, km: Math.round(km), co2: Number(co2.toFixed(1)) }));

        if (evolucao.length === 0) evolucao.push({ mes: 'Atual', km: 0, co2: 0 });

        return {
            totalDistancia: dist,
            totalCO2: co2,
            totalEnergia: dist * 0.18,
            veiculosRanking: ranking,
            evolucaoMensal: evolucao
        };
    }, [historicoRotas]);

    // --- FETCH ATUALIZADO PARA USAR FILTROS ---
    const fetchHistorico = useCallback(async (inicio = dataInicio, fim = dataFim) => {
        try {
            setLoading(true);
            setError(null);

            // Formata datas para YYYY-MM-DD se existirem
            const formatDate = (date) => date ? date.toISOString().split('T')[0] : null;

            const response = await consultarViagem(formatDate(inicio), formatDate(fim));
            setHistoricoRotas(response.data);
        } catch (err) {
            setError("Não foi possível carregar o histórico de rotas.");
            console.error("Erro ao buscar histórico:", err);
        } finally {
            setLoading(false);
        }
    }, [dataInicio, dataFim]);

    useEffect(() => {
        fetchHistorico();
    }, [fetchHistorico]);

    // --- FUNÇÃO QUE FALTAVA ---
    const aplicarFiltro = (inicio, fim) => {
        setDataInicio(inicio);
        setDataFim(fim);
        // Força o fetch com os novos valores imediatamente
        fetchHistorico(inicio, fim);
    };

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
        estatisticas,
        // Novos exports
        aplicarFiltro,
        dataInicio,
        dataFim
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