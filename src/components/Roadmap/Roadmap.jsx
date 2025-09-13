"use client";

export default function Roadmap() {
    return (
        // Seção principal com fundo escuro, ocupando a largura total
        <section id="roadmap" className="w-full py-32 px-6 text-center">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-8 drop-shadow">
                    🗺️ Roadmap do Projeto
                </h2>
                <p className="max-w-4xl mx-auto text-xl text-slate-300 leading-relaxed mb-24">
                    Acompanhe nossa jornada para revolucionar a mobilidade elétrica no Brasil.
                </p>

                {/* Container para a linha do tempo */}
                <div className="relative">
                    {/* A linha que conecta os milestones (visível apenas em telas médias e maiores) */}
                    <div className="hidden md:block absolute top-7 left-0 w-full h-1 bg-slate-700"></div>

                    {/* Grid para os milestones */}
                    <div className="relative grid grid-cols-1 md:grid-cols-4 gap-y-12 md:gap-x-8">

                        {/* Milestone 1: Concluído */}
                        <div className="flex flex-col items-center px-4">
                            <div className="w-14 h-14 rounded-full border-4 border-green-400 bg-green-400 text-slate-900 flex items-center justify-center text-2xl z-10 mb-4">
                                <i className="fas fa-lightbulb"></i>
                            </div>
                            <h4 className="text-lg font-semibold text-white">Conceito e Pesquisa</h4>
                            <p className="text-slate-400 text-sm mt-1">Validação da ideia e planejamento técnico.</p>
                            <span className="mt-3 text-sm font-bold text-green-400">Concluído</span>
                        </div>

                        {/* Milestone 2: Em Andamento */}
                        <div className="flex flex-col items-center px-4">
                            <div className="w-14 h-14 rounded-full border-4 border-blue-500 bg-blue-500 text-white flex items-center justify-center text-2xl z-10 mb-4 ring-4 ring-blue-500/20 animate-pulse">
                                <i className="fas fa-cogs"></i>
                            </div>
                            <h4 className="text-lg font-semibold text-white">Desenvolvimento MVP</h4>
                            <p className="text-slate-400 text-sm mt-1">Construção do produto mínimo viável.</p>
                            <span className="mt-3 text-sm font-bold text-blue-500">Em Andamento</span>
                        </div>

                        {/* Milestone 3: Próximos Passos */}
                        <div className="flex flex-col items-center px-4">
                            <div className="w-14 h-14 rounded-full border-4 border-slate-600 bg-slate-800 text-slate-400 flex items-center justify-center text-2xl z-10 mb-4">
                                <i className="fas fa-rocket"></i>
                            </div>
                            <h4 className="text-lg font-semibold text-white">Lançamento Beta</h4>
                            <p className="text-slate-400 text-sm mt-1">Abertura para os primeiros usuários.</p>
                            <span className="mt-3 text-sm font-bold text-slate-400">Próximos Passos</span>
                        </div>

                        {/* Milestone 4: Futuro */}
                        <div className="flex flex-col items-center px-4">
                            <div className="w-14 h-14 rounded-full border-4 border-slate-600 bg-slate-800 text-slate-400 flex items-center justify-center text-2xl z-10 mb-4">
                                <i className="fas fa-globe"></i>
                            </div>
                            <h4 className="text-lg font-semibold text-white">Expansão Nacional</h4>
                            <p className="text-slate-400 text-sm mt-1">Novas funcionalidades e cobertura completa.</p>
                            <span className="mt-3 text-sm font-bold text-slate-400">Futuro</span>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}