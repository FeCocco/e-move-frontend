"use client";
import { CheckCircle, Circle, Clock, Rocket } from 'lucide-react';

export default function Roadmap() {
    const milestones = [
        {
            phase: "Fase 1",
            title: "Conceito e Validação",
            description: "Pesquisa de mercado, definição de escopo e prototipação inicial",
            status: "completed",
            date: "Q1 2025",
            icon: CheckCircle
        },
        {
            phase: "Fase 2",
            title: "Desenvolvimento MVP",
            description: "Construção das funcionalidades core e testes internos",
            status: "completed",
            date: "Q2 2025",
            icon: CheckCircle
        },
        {
            phase: "Fase 3",
            title: "Lançamento Beta",
            description: "Abertura para primeiros usuários e coleta de feedback",
            status: "active",
            date: "Q4 2025",
            icon: Circle
        },
        {
            phase: "Fase 4",
            title: "Expansão Nacional",
            description: "Cobertura completa do território e parcerias estratégicas",
            status: "upcoming",
            date: "Q1 2026",
            icon: Circle
        }
    ];

    const MilestoneCard = ({ milestone }) => (
        <div className={`inline-block p-6 bg-white/5 backdrop-blur rounded-2xl border w-full ${
            milestone.status === 'completed' ? 'border-verde-claro/50' :
                milestone.status === 'active' ? 'border-azul-claro/50 animate-pulse' :
                    'border-white/10'
        }`}>
            <span className={`text-sm font-medium ${
                milestone.status === 'completed' ? 'text-verde-claro' :
                    milestone.status === 'active' ? 'text-azul-claro' :
                        'text-texto-claro/50'
            }`}>{milestone.phase} • {milestone.date}</span>
            <h3 className="text-xl font-semibold text-white mt-2 mb-3">{milestone.title}</h3>
            <p className="text-texto-claro/60 text-sm">{milestone.description}</p>
        </div>
    );

    return (
        <section id="roadmap" className="w-full py-24 px-6 ">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-azul-claro/10 border border-azul-claro/20 rounded-full mb-6">
                        <Rocket className="w-4 h-4 text-azul-claro" />
                        <span className="text-sm text-azul-claro font-medium">Roadmap</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Nossa Jornada para o
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-verde-claro to-azul-claro">
                            Futuro Sustentável
                        </span>
                    </h2>
                </div>

                <div className="relative">
                    <div className="absolute top-0 h-full w-0.5 bg-gradient-to-b from-verde-claro via-azul-claro to-transparent left-6 sm:left-1/2 sm:-translate-x-1/2"></div>
                    <div className="space-y-12">
                        {milestones.map((milestone, index) => (
                            <div key={index} className={`relative sm:flex sm:items-center sm:gap-8 ${index % 2 !== 0 ? 'sm:flex-row-reverse' : ''}`}>

                                <div className={`pl-20 sm:pl-0 sm:flex-1 ${index % 2 !== 0 ? 'sm:text-left' : 'sm:text-right'}`}>
                                    <MilestoneCard milestone={milestone} />
                                </div>

                                <div className="absolute top-0 left-0 sm:relative z-10">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                        milestone.status === 'completed' ? 'bg-verde-claro text-slate-900' :
                                            milestone.status === 'active' ? 'bg-azul-claro text-slate-900' :
                                                'bg-slate-800 text-texto-claro/50'
                                    }`}>
                                        <milestone.icon className="w-6 h-6" />
                                    </div>
                                </div>

                                <div className="hidden sm:block sm:flex-1"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}