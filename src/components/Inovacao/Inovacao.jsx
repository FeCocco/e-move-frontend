"use client";
import AnimatedStat from './AnimatedStat';

export default function Inovacao() {
    return (
        <section id="inovacao" className="w-full py-32 px-6">
            <div className="max-w-7xl mx-auto text-center">

                {/* Seção de Estatísticas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
                    <AnimatedStat
                        icon="fa-leaf"
                        finalValue={180000}
                        label="Veículos Elétricos Leves em Circulação no Brasil"
                    />
                    <AnimatedStat
                        icon="fa-charging-station"
                        finalValue={4300}
                        label="Eletropostos Públicos e Semipúblicos no País"
                    />
                    <AnimatedStat
                        icon="fa-users"
                        finalValue={1500}
                        label="Usuários na Nossa Lista de Espera"
                    />
                </div>

                {/* Seção de Funcionalidades */}
                <h2 className="text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-8 drop-shadow">
                    💡 Como o e-Move Resolve Isso
                </h2>
                <p className="max-w-4xl mx-auto text-xl text-slate-300 leading-relaxed mb-16">
                    Nossa plataforma ataca diretamente os principais desafios da mobilidade elétrica, oferecendo ferramentas inteligentes para motoristas e empresas.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
                    <div className="bg-slate-800 p-8 rounded-2xl border border-blue-500/20 hover:-translate-y-2 transition-transform duration-300">
                        <i className="fas fa-map-location-dot text-green-400 text-3xl mb-4"></i>
                        <h4 className="text-lg font-semibold text-white mb-2">Planejamento de Rota Inteligente</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">Combata a ansiedade de autonomia. Nosso algoritmo calcula a rota e, se necessário, adiciona as paradas de recarga ideais.</p>
                    </div>
                    <div className="bg-slate-800 p-8 rounded-2xl border border-blue-500/20 hover:-translate-y-2 transition-transform duration-300">
                        <i className="fas fa-car-battery text-green-400 text-3xl mb-4"></i>
                        <h4 className="text-lg font-semibold text-white mb-2">Gestão de Veículos</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">Cadastre múltiplos veículos e suas autonomias. Nossos cálculos são feitos sob medida para o seu carro, garantindo precisão.</p>
                    </div>
                    <div className="bg-slate-800 p-8 rounded-2xl border border-blue-500/20 hover:-translate-y-2 transition-transform duration-300">
                        <i className="fas fa-charging-station text-green-400 text-3xl mb-4"></i>
                        <h4 className="text-lg font-semibold text-white mb-2">Base de Estações Unificada</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">Encontre milhares de pontos de recarga com detalhes e comentários de usuários em um só lugar, acabando com a fragmentação.</p>
                    </div>
                    <div className="bg-slate-800 p-8 rounded-2xl border border-blue-500/20 hover:-translate-y-2 transition-transform duration-300">
                        <i className="fas fa-sitemap text-green-400 text-3xl mb-4"></i>
                        <h4 className="text-lg font-semibold text-white mb-2">Otimização para Frotas</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">Planeje rotas para múltiplos veículos, monitore o consumo e reduza custos com relatórios inteligentes.</p>
                    </div>
                </div>

            </div>
        </section>
    );
}