"use client";
import AnimatedStat from './AnimatedStat';
import { Car, Zap, Users, MapPin, BatteryCharging, Network, TrendingUp, Shield } from 'lucide-react';

export default function Inovacao() {
    const features = [
        {
            icon: MapPin,
            title: "Rotas Inteligentes",
            description: "Algoritmo avançado que calcula a melhor rota considerando autonomia, tráfego e pontos de recarga.",
            highlight: "Algoritmo OSRM"
        },
        {
            icon: BatteryCharging,
            title: "Gestão de Bateria",
            description: "Monitore o consumo em tempo real e receba alertas inteligentes sobre o melhor momento para recarregar.",
            highlight: "Real-time"
        },
        {
            icon: Network,
            title: "Rede Unificada",
            description: "Acesso a mais de 4.300 pontos de recarga com informações atualizadas de disponibilidade e preços.",
            highlight: "OpenChargeMap"
        },
        {
            icon: Shield,
            title: "Para Empresas",
            description: "Dashboard completo para gestão de frotas com relatórios de economia e impacto ambiental.",
            highlight: "B2B Ready"
        }
    ];

    return (
        <section id="inovacao" className="w-full py-24 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    <AnimatedStat
                        icon={Car}
                        finalValue={100000000}
                        label="Veículos Elétricos no Mundo"
                        prefix="≈ "
                        numberFormat="compact"
                    />
                    <AnimatedStat
                        icon={Users}
                        finalValue={30}
                        label="Veículos Pé-Cadastrados no Sistema"
                    />

                    <AnimatedStat
                        icon={Zap}
                        finalValue={530000}
                        label="Pontos de Recarga Mapeados"
                        prefix="≈ "
                    />
                </div>

                {/* Features Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-azul-claro/10 border border-azul-claro/20 rounded-full mb-6">
                        <TrendingUp className="w-4 h-4 text-azul-claro" />
                        <span className="text-sm text-azul-claro font-medium">Soluções Inovadoras</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Tecnologia que Resolve
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-verde-claro to-azul-claro">
                            Problemas Reais
                        </span>
                    </h2>

                    <p className="max-w-3xl mx-auto text-lg text-texto-claro/70 leading-relaxed">
                        Combinamos dados em tempo real e uma interface intuitiva
                        para eliminar as principais barreiras da mobilidade elétrica.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature) => (
                        <div key={feature.title} className="group relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-verde-claro/20 to-azul-claro/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative p-8 bg-slate-800/50 backdrop-blur rounded-2xl border border-white/10 h-full transition-all duration-300 group-hover:border-verde-claro/30">
                                <div className="absolute -top-3 -right-3 px-3 py-1 bg-verde-claro/90 text-slate-900 text-xs font-bold rounded-full">
                                    {feature.highlight}
                                </div>
                                <feature.icon className="w-10 h-10 text-azul-claro mb-4" />
                                <h3 className="text-lg font-semibold text-white mb-3">{feature.title}</h3>
                                <p className="text-sm text-texto-claro/60 leading-relaxed">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}