import VeiculoChart from '@/components/Charts/VeiculoChart';
import PostoChart from '@/components/Charts/PostoChart';
import RotasChart from '@/components/Charts/RotasChart';
import SatisfacaoChart from '@/components/Charts/SatisfacaoChart';
import StatCard from '@/components/Charts/StatCard';
import AnimatedCar from '@/components/Charts/AnimatedCar';
import { Route, Zap, Droplets } from 'lucide-react';

export default function AbaRelatorio() {
    return (
        <div className="px-2 sm:px-4">
            <h2 className="text-2xl font-orbitron text-verde-claro mb-2 text-center">
                Meus Relatórios
            </h2>
            <p className="text-texto-claro/80 mb-6 text-center">
                Visualize os dados e métricas de uso do seu aplicativo e-Move.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 auto-rows-fr">
                {/* Veículos */}
                <div className="bg-black/20 p-4 sm:p-5 md:p-6 rounded-lg flex flex-col space-y-4">
                    <h3 className="text-lg font-semibold text-azul-claro text-center">
                        Veículos Mais Utilizados
                    </h3>
                    <div className="flex-1">
                        <VeiculoChart />
                    </div>
                </div>

                {/* Satisfação */}
                <div className="bg-black/20 p-4 sm:p-5 md:p-6 rounded-lg flex flex-col justify-between space-y-4">
                    <h3 className="text-lg font-semibold text-azul-claro text-center">
                        Satisfação e Resumo
                    </h3>

                    <div className="flex-1">
                        <SatisfacaoChart />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <StatCard icon={Route} value="1.280" unit="km" label="Distância" />
                        <StatCard icon={Zap} value="256" unit="kWh" label="Energia" />
                        <StatCard icon={Droplets} value="1.152" unit="kg" label="CO₂" />
                    </div>

                    <AnimatedCar />
                </div>

                {/* Rotas */}
                <div className="bg-black/20 p-4 sm:p-5 md:p-6 rounded-lg flex flex-col space-y-4">
                    <h3 className="text-lg font-semibold text-azul-claro text-center">
                        Rotas Preferidas
                    </h3>
                    <div className="flex-1">
                        <RotasChart />
                    </div>
                    <div className="flex-1">
                        <PostoChart />
                    </div>
                </div>

                {/*
                <div className="bg-black/20 p-4 sm:p-5 md:p-6 rounded-lg flex flex-col space-y-4">
                    <h3 className="text-lg font-semibold text-azul-claro text-center">
                        Postos de Recarga Frequentes
                    </h3>
                    <div className="flex-1">
                        <PostoChart />
                    </div>
                </div> */}
            </div>
        </div>
    );
}
