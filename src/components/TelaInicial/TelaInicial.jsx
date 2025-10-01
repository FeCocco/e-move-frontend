'use client';
import React from 'react';
import Logo from '../Logo/Logo';
import { useRouter } from 'next/navigation';
import { ChevronDown, MapPin, Battery, Users, Leaf } from 'lucide-react';
import { Link as ScrollLink } from 'react-scroll';

const TelaInicial = () => {
    const router = useRouter();

    const handleStart = () => {
        router.push('/login');
    };

    const features = [
        { icon: MapPin, text: "Rotas Otimizadas" },
        { icon: Battery, text: "Pontos de Recarga" },
        { icon: Users, text: "Gestão de Frotas" },
        { icon: Leaf, text: "Impacto Ambiental" }
    ];

    return (
        <section id="inicio" className="w-full min-h-screen relative overflow-hidden">

            <div className="relative z-20 w-full">
                <div className="min-h-screen flex flex-col justify-center items-center p-4">

                    {/* Hero Section */}
                    <div className="flex flex-col items-center text-center max-w-5xl mx-auto pt-20">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-verde-claro/10 border border-verde-claro/20 rounded-full mb-8">
                            <Leaf className="w-4 h-4 text-verde-claro" />
                            <span className="text-sm text-verde-claro font-medium">Mobilidade Sustentável</span>
                        </div>

                        <Logo className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-wide mb-6 text-azul-claro" />

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                            O Futuro da Mobilidade Elétrica
                            <span className="block text-2xl sm:text-3xl lg:text-4xl text-texto-claro/80 font-normal mt-2">
                                está ao seu alcance
                            </span>
                        </h1>

                        <p className="text-lg sm:text-xl text-texto-claro/70 mb-8 max-w-3xl leading-relaxed">
                            Planeje rotas inteligentes, encontre pontos de recarga e gerencie sua frota elétrica
                            em uma única plataforma. Transforme a ansiedade de autonomia em confiança total.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-12">
                            <button
                                className="group relative px-8 py-4 bg-gradient-to-r from-verde-claro to-azul-claro text-slate-900 font-bold rounded-xl text-lg transition-all duration-300 hover:shadow-lg hover:shadow-verde-claro/25 hover:-translate-y-0.5"
                                onClick={handleStart}
                            >
                                <span className="relative z-10">Começar Agora</span>
                            </button>

                            <ScrollLink
                                to="sobre-nos"
                                spy={true}
                                smooth={true}
                                offset={-90}
                                duration={500}
                                className="px-8 py-4 bg-white/5 backdrop-blur border border-white/10 text-white font-medium rounded-xl text-lg transition-all duration-300 hover:bg-white/10 hover:border-white/20 cursor-pointer"
                            >
                                Saiba Mais
                            </ScrollLink>
                        </div>

                        {/* Feature Pills */}
                        <div className="flex flex-wrap justify-center gap-4 mb-16">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur border border-white/10 rounded-full"
                                >
                                    <feature.icon className="w-4 h-4 text-azul-claro" />
                                    <span className="text-sm text-texto-claro/80">{feature.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* Scroll Indicator }
                        <ScrollLink
                            to="sobre-nos"
                            spy={true}
                            smooth={true}
                            offset={-90}
                            duration={500}
                            className="animate-bounce cursor-pointer"
                        >
                            <ChevronDown className="w-8 h-8 text-azul-claro/50" />
                        </ScrollLink>*/}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TelaInicial;