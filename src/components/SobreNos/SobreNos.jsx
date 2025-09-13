"use client";
import MemberCard from ".//MemberCard";

export default function SobreNos() {
    return (
        <section id="sobre-nos" className="w-full py-32 px-6 text-center">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-8 drop-shadow">
                    🚀 Nossa Missão
                </h2>
                <p className="max-w-4xl mx-auto text-xl text-slate-300 leading-relaxed mb-20">
                    A transição para a mobilidade elétrica é uma realidade, mas viajar longas distâncias no Brasil ainda gera desafios como a <strong className="text-white">ansiedade de autonomia</strong> e o <strong className="text-white">planejamento complexo</strong> de paradas para recarga. O <span className="font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">e-Move</span> nasceu para eliminar essas barreiras, tornando a experiência de dirigir um elétrico simples e confiável para todos.
                </p>

                <h3 className="text-3xl font-semibold text-white mb-12">👥 A Equipe</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                    <MemberCard icon="fa-code" name="Felipe Giacomini Cocco" id="116525" animation="animate-pulseGlow" />
                    <MemberCard icon="fa-database" name="Fernando Gabriel Perinotto" id="115575" animation="animate-floatVertical" />
                    <MemberCard icon="fa-bolt" name="Jhonatas Kévin de Oliveira Braga" id="116707" animation="animate-flicker" />
                    <MemberCard icon="fa-laptop-code" name="Lucas Santos Souza" id="116852" animation="animate-rocking" />
                    <MemberCard icon="fa-network-wired" name="Samuel Wilson Rufino" id="117792" animation="animate-pulseExpand" />
                </div>
            </div>
        </section>
    );
}