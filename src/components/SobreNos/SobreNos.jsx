"use client";

export default function SobreNos() {
    return (
        <section id="sobre-nos" className="w-full bg-slate-900 py-32 px-6 text-center">
            <div className="max-w-7xl mx-auto">

                <h2 className="text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-8 drop-shadow">
                    🚀 Nossa Missão
                </h2>
                <p className="max-w-4xl mx-auto text-xl text-slate-300 leading-relaxed mb-20">
                    A transição para a mobilidade elétrica é uma realidade, mas viajar longas distâncias no Brasil ainda gera desafios como a <strong className="text-white">ansiedade de autonomia</strong> e o <strong className="text-white">planejamento complexo</strong> de paradas para recarga. O <span className="font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">e-Move</span> nasceu para eliminar essas barreiras, tornando a experiência de dirigir um elétrico simples e confiável para todos.
                </p>

                <h3 className="text-3xl font-semibold text-white mb-12">👥 A Equipe</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">

                    <div className="bg-slate-800 p-8 rounded-2xl shadow hover:-translate-y-2 hover:shadow-lg transition-transform duration-300">
                        <i className="fas fa-code text-blue-400 text-4xl mb-5 animate-pulseGlow"></i>
                        <h4 className="text-lg text-green-400 font-semibold">Felipe Giacomini Cocco</h4>
                        <span className="text-slate-400 text-sm mt-1">116525</span>
                    </div>
                    <div className="bg-slate-800 p-8 rounded-2xl shadow hover:-translate-y-2 hover:shadow-lg transition-transform duration-300">
                        <i className="fas fa-database text-blue-400 text-4xl mb-5 animate-floatVertical"></i>
                        <h4 className="text-lg text-green-400 font-semibold">Fernando Gabriel Perinotto</h4>
                        <span className="text-slate-400 text-sm mt-1">115575</span>
                    </div>
                    <div className="bg-slate-800 p-8 rounded-2xl shadow hover:-translate-y-2 hover:shadow-lg transition-transform duration-300">
                        <i className="fas fa-bolt text-blue-400 text-4xl mb-5 animate-flicker"></i>
                        <h4 className="text-lg text-green-400 font-semibold">Jhonatas Kévin de Oliveira Braga</h4>
                        <span className="text-slate-400 text-sm mt-1">116707</span>
                    </div>
                    <div className="bg-slate-800 p-8 rounded-2xl shadow hover:-translate-y-2 hover:shadow-lg transition-transform duration-300">
                        <i className="fas fa-laptop-code text-blue-400 text-4xl mb-5 animate-rocking"></i>
                        <h4 className="text-lg text-green-400 font-semibold">Lucas Santos Souza</h4>
                        <span className="text-slate-400 text-sm mt-1">116852</span>
                    </div>
                    <div className="bg-slate-800 p-8 rounded-2xl shadow hover:-translate-y-2 hover:shadow-lg transition-transform duration-300">
                        <i className="fas fa-network-wired text-blue-400 text-4xl mb-5 animate-pulseExpand"></i>
                        <h4 className="text-lg text-green-400 font-semibold">Samuel Wilson Rufino</h4>
                        <span className="text-slate-400 text-sm mt-1">117792</span>
                    </div>
                </div>
            </div>
        </section>
    );
}