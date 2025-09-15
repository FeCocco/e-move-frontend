"use client";
import AnimatedStat from './AnimatedStat';
import MemberCard from '../SobreNos/MemberCard'; // Reutilize o MemberCard
import { Leaf, Zap, Users, MapPin, BatteryCharging, Network, Lightbulb } from 'lucide-react';

export default function Inovacao() {
    const features = [
        { icon: MapPin, title: "Planejamento de Rota Inteligente", description: "Combata a ansiedade de autonomia. Nosso algoritmo calcula a rota e, se necessário, adiciona as paradas de recarga ideais." },
        { icon: BatteryCharging, title: "Gestão de Veículos", description: "Cadastre múltiplos veículos e suas autonomias. Nossos cálculos são feitos sob medida para o seu carro, garantindo precisão." },
        { icon: Zap, title: "Base de Estações Unificada", description: "Encontre milhares de pontos de recarga com detalhes e comentários de usuários em um só lugar, acabando com a fragmentação." },
        { icon: Network, title: "Otimização para Frotas", description: "Planeje rotas para múltiplos veículos, monitore o consumo e reduza custos com relatórios inteligentes." }
    ];

    return (
        <section id="inovacao" className="w-full py-32 px-6">
            <div className="max-w-7xl mx-auto text-center">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
                    <AnimatedStat icon={Leaf} finalValue={180000} label="Veículos Elétricos Leves em Circulação no Brasil" />
                    <AnimatedStat icon={Zap} finalValue={4300} label="Eletropostos Públicos e Semipúblicos no País" />
                    <AnimatedStat icon={Users} finalValue={1500} label="Usuários na Nossa Lista de Espera" />
                </div>
                <h2 className="text-5xl font-bold drop-shadow flex items-center justify-center gap-4 mb-8">
                    <Lightbulb size={48} className="text-green-400" />
                    <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent leading-snug">Como o e-Move Resolve Isso</span>
                </h2>
                <p className="max-w-4xl mx-auto text-xl text-slate-300 leading-relaxed mb-16">
                    Nossa plataforma ataca diretamente os principais desafios da mobilidade elétrica, oferecendo ferramentas inteligentes para motoristas e empresas.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature) => (
                        <MemberCard
                            key={feature.title}
                            icon={feature.icon}
                            contentClassName="text-left"
                        >

                            <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
                            <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                        </MemberCard>
                    ))}
                </div>
            </div>
        </section>
    );
}