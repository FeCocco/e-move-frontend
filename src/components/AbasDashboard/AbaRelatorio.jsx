"use client";
import { useViagens } from "@/context/ViagensContext";
import EvolucaoChart from '@/components/Charts/EvolucaoChart';
import VeiculoChart from '@/components/Charts/VeiculoChart';
import StatCard from '@/components/Charts/StatCard';
import AnimatedCar from '@/components/Charts/AnimatedCar';
import { Route, Zap, Droplets } from 'lucide-react';


export default function AbaRelatorio() {
    const { estatisticas, loading } = useViagens();


    // Valores seguros (0 se undefined)
    const {
        totalDistancia = 0,
        totalEnergia = 0,
        totalCO2 = 0,
        veiculosRanking = [],
        evolucaoMensal = []
    } = estatisticas || {};

    return (
        <div className="px-1 sm:px-2 py-2">
            <h2 className="text-2xl font-orbitron text-verde-claro mb-2 text-center">
                Meus Relatórios
            </h2>
            <p className="text-texto-claro/80 mb-8 text-center max-w-2xl mx-auto">
                Acompanhe métricas reais do seu impacto e consumo.
            </p>

            {/* --- GRID PRINCIPAL --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

                {/* 1. CARD ÚNICO DE RESUMO (Topo - Ocupa toda a largura) */}
                <div className="lg:col-span-3 bg-black/20 border border-white/10 p-6 rounded-xl flex flex-col gap-6 relative overflow-hidden">

                    {/* Título da Seção */}
                    <h3 className="text-lg font-semibold text-azul-claro flex items-center gap-2">
                        <Zap size={20} /> Resumo Geral
                    </h3>

                    {/* Grid dos 3 Cards Internos */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 z-10">
                        <StatCard
                            icon={Route}
                            value={totalDistancia.toFixed(0)}
                            unit="km"
                            label="Distância Total"
                        />
                        <StatCard
                            icon={Zap}
                            value={totalEnergia.toFixed(0)}
                            unit="kWh"
                            label="Energia Estimada"
                        />
                        <StatCard
                            icon={Droplets}
                            value={totalCO2.toFixed(1)}
                            unit="kg"
                            label="CO₂ Evitado"
                        />
                    </div>

                    {/* O Carrinho volta aqui, na parte inferior do card */}
                    <div className="mt-2 pt-4 border-t border-white/5">
                        <AnimatedCar />
                    </div>
                </div>

                {/* 2. GRÁFICO DE EVOLUÇÃO (Principal - 2/3 da largura) */}
                <div className="lg:col-span-2 bg-black/20 border border-white/10 rounded-xl overflow-hidden flex flex-col h-[400px]">
                    <EvolucaoChart data={evolucaoMensal} />
                </div>

                {/* 3. GRÁFICO DE VEÍCULOS (Lateral - 1/3 da largura) */}
                <div className="lg:col-span-1 bg-black/20 border border-white/10 rounded-xl overflow-hidden flex flex-col h-[400px]">
                    <VeiculoChart data={veiculosRanking} />
                </div>

            </div>
        </div>
    );
}