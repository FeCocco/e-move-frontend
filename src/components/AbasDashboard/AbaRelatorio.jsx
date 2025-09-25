import VeiculoChart from '@/components/Charts/VeiculoChart';
import PostoChart from '@/components/Charts/PostoChart';
import RotasChart from '@/components/Charts/RotasChart';
import SatisfacaoChart from '@/components/Charts/SatisfacaoChart';
import StatCard from '@/components/Charts/StatCard';
import AnimatedCar from '@/components/Charts/AnimatedCar';
import { Route, Zap, Droplets } from 'lucide-react';

export default function AbaRelatorio() {
    return (
        <div className="px-1 sm:px-4">
            <h2 className="text-2xl font-orbitron text-verde-claro mb-2 text-center">
                Meus Relatórios
            </h2>
            <p className="text-texto-claro/80 mb-6 text-center max-w-2xl mx-auto">
                Visualize os dados e métricas de uso do seu aplicativo e-Move.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
                {/* O card de Satisfação agora ocupa duas colunas em telas grandes para melhor equilíbrio */}
                <div className="md:col-span-1 lg:col-span-2 bg-black/20 p-4 sm:p-5 md:p-6 rounded-lg flex flex-col justify-between space-y-4">
                    <h3 className="text-lg font-semibold text-azul-claro text-center">
                        Satisfação e Resumo
                    </h3>

                    <div className="flex-1 min-h-[200px]">
                        <SatisfacaoChart />
                    </div>

                    <div className="grid grid-cols-3 gap-3 pt-4">
                        <StatCard icon={Route} value="1.280" unit="km" label="Distância" />
                        <StatCard icon={Zap} value="256" unit="kWh" label="Energia" />
                        <StatCard icon={Droplets} value="1.152" unit="kg" label="CO₂" />
                    </div>

                    <AnimatedCar />
                </div>

                {/* Veículos */}
                <div className="bg-black/20 p-4 sm:p-5 md:p-6 rounded-lg flex flex-col space-y-4">
                    <h3 className="text-lg font-semibold text-azul-claro text-center">
                        Veículos Mais Utilizados
                    </h3>
                    <div className="flex-1 min-h-[300px]">
                        <VeiculoChart />
                    </div>
                </div>

                {/* Rotas e Postos */}
                <div className="lg:col-span-3 xl:col-span-1 bg-black/20 p-4 sm:p-5 md:p-6 rounded-lg flex flex-col space-y-4">
                    <h3 className="text-lg font-semibold text-azul-claro text-center">
                        Rotas e Postos
                    </h3>
                    <div className="flex-1 min-h-[200px]">
                        <RotasChart />
                    </div>
                    <div className="flex-1 min-h-[200px]">
                        <PostoChart />
                    </div>
                </div>
            </div>
        </div>
    );
}
