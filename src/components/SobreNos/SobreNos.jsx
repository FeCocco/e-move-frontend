"use client";
import { Target, Users, Sparkles } from 'lucide-react';

export default function SobreNos() {
    const team = [
        { name: "Felipe Giacomini Cocco", id: "116525", role: "FullStack", github: "FeCocco" },
        { name: "Fernando Gabriel Perinotto", id: "115575", role: "Banco de Dados", github: "yFernand0W7" },
        { name: "Jhonatas K. de Oliveira Braga", id: "116707", role: "QA", github: "jhonataskevin" },
        { name: "Lucas Santos Souza", id: "116852", role: "UI/UX" },
        { name: "Samuel Wilson Rufino", id: "117792", role: "Infraestrutura", github: "sawiiru" }
    ];

    return (
        <section id="sobre-nos" className="w-full py-20 sm:py-24 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 sm:mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-verde-claro/10 border border-verde-claro/20 rounded-full mb-6">
                        <Target className="w-4 h-4 text-verde-claro" />
                        <span className="text-sm text-verde-claro font-medium">Nossa Missão</span>
                    </div>

                    <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                        Simplificando a Transição para a
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-verde-claro to-azul-claro">
                            Mobilidade Elétrica
                        </span>
                    </h2>

                    <p className="max-w-3xl mx-auto text-base sm:text-lg text-texto-claro/70 leading-relaxed">
                        A adoção de veículos elétricos cresce exponencialmente, mas a infraestrutura
                        e as ferramentas de suporte ainda estão fragmentadas. O e-Move une tudo
                        em uma plataforma intuitiva, eliminando barreiras e acelerando a mobilidade sustentável no Brasil.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-20">
                    <div className="text-center p-8 bg-white/5 backdrop-blur rounded-2xl border border-white/10">
                        <div className="w-16 h-16 mx-auto mb-4 bg-verde-claro/10 rounded-xl flex items-center justify-center">
                            <Sparkles className="w-8 h-8 text-verde-claro" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Inovação</h3>
                        <p className="text-texto-claro/60">Tecnologia de ponta para resolver problemas reais</p>
                    </div>

                    <div className="text-center p-8 bg-white/5 backdrop-blur rounded-2xl border border-white/10">
                        <div className="w-16 h-16 mx-auto mb-4 bg-azul-claro/10 rounded-xl flex items-center justify-center">
                            <Target className="w-8 h-8 text-azul-claro" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Simplicidade</h3>
                        <p className="text-texto-claro/60">Interface intuitiva e experiência sem fricção</p>
                    </div>

                    <div className="text-center p-8 bg-white/5 backdrop-blur rounded-2xl border border-white/10">
                        <div className="w-16 h-16 mx-auto mb-4 bg-verde-claro/10 rounded-xl flex items-center justify-center">
                            <Users className="w-8 h-8 text-verde-claro" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Comunidade</h3>
                        <p className="text-texto-claro/60">Construindo o futuro sustentável juntos</p>
                    </div>
                </div>

                <div className="text-center">
                    <h3 className="text-2xl sm:text-3xl font-semibold text-white mb-8">Conheça Nossa Equipe</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {team.map((member, index) => (
                            <div key={index} className="group relative ">
                                <div className="min-h-56 p-6 bg-white/5 backdrop-blur rounded-xl border border-white/10 transition-all duration-300 group-hover:bg-white/10 group-hover:border-verde-claro/30">
                                    {member.github ? (
                                        <a
                                            href={`https://github.com/${member.github}`}
                                            target="_blank"
                                            rel="noreferrer noopener"
                                            aria-label={`Abrir GitHub de ${member.name}`}
                                            className="inline-block"
                                            title={`GitHub: ${member.github}`}
                                        >
                                            <img
                                                className="w-12 h-12 mx-auto mb-4 rounded-full object-cover ring-2 ring-white/10 transition-transform duration-200 hover:scale-105"
                                                src={`https://github.com/${member.github}.png?size=128`}
                                                alt={`Foto de ${member.name}`}
                                                loading="lazy"
                                                referrerPolicy="no-referrer"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = "none";
                                                }}
                                            />
                                        </a>
                                    ) : (
                                        <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-verde-claro to-azul-claro rounded-full" />
                                    )}

                                    <h4 className="text-white font-medium mb-1">{member.name}</h4>
                                    <p className="text-xs text-azul-claro mb-2">{member.role}</p>
                                    <p className="text-xs text-texto-claro/50">{member.id}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}