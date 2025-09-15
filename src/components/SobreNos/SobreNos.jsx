"use client";
import { Coffee, Code, Database, Laptop, Network, Rocket, Users } from 'lucide-react';
import MemberCard from "./MemberCard";

export default function SobreNos() {
    return (
        <section id="sobre-nos" className="w-full py-32 px-6 text-center">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-5xl font-bold drop-shadow flex items-center justify-center gap-4 mb-8">
                    <Rocket size={48} strokeWidth={2.5} className="text-green-400" />
                    <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">Nossa Missão</span>
                </h2>
                <p className="max-w-4xl mx-auto text-xl text-slate-300 leading-relaxed mb-20">
                    A transição para a mobilidade elétrica é uma realidade...
                </p>
                <h3 className="text-3xl font-semibold text-white mb-12 flex items-center justify-center gap-3">
                    <Users size={32} /> A Equipe
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                    <MemberCard icon={Coffee} animation="animate-pulseGlow">
                        <h4 className="text-lg text-green-400 font-semibold">Felipe Giacomini Cocco</h4>
                        <span className="text-slate-400 text-sm mt-1">116525</span>
                    </MemberCard>
                    <MemberCard icon={Database} animation="animate-floatVertical">
                        <h4 className="text-lg text-green-400 font-semibold">Fernando Gabriel Perinotto</h4>
                        <span className="text-slate-400 text-sm mt-1">115575</span>
                    </MemberCard>
                    <MemberCard icon={Network} animation="animate-flicker">
                        <h4 className="text-lg text-green-400 font-semibold">Jhonatas Kévin de Oliveira Braga</h4>
                        <span className="text-slate-400 text-sm mt-1">116707</span>
                    </MemberCard>
                    <MemberCard icon={Code} animation="animate-rocking">
                        <h4 className="text-lg text-green-400 font-semibold">Lucas Santos Souza</h4>
                        <span className="text-slate-400 text-sm mt-1">116852</span>
                    </MemberCard>
                    <MemberCard icon={Laptop} animation="animate-pulseExpand">
                        <h4 className="text-lg text-green-400 font-semibold">Samuel Wilson Rufino</h4>
                        <span className="text-slate-400 text-sm mt-1">117792</span>
                    </MemberCard>
                </div>
            </div>
        </section>
    );
}