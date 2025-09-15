"use client";

import { MessageSquare } from 'lucide-react';

export default function Suporte() {
    const faqItems = [
        {
            question: "Como o e-Move calcula as paradas para recarga?",
            answer: "Nosso sistema cruza a distância da rota com a autonomia do seu veículo e busca o ponto ideal para recarga, localizando os postos mais próximos."
        },
        {
            question: "Posso cadastrar mais de um veículo?",
            answer: "Sim! Em seu perfil, você pode adicionar, editar e remover quantos veículos quiser, selecionando o carro certo para cada viagem."
        },
        {
            question: "O e-Move serve para empresas?",
            answer: "Sim! Nossa plataforma inclui funcionalidades específicas para otimizar a logística e reduzir custos na eletrificação de frotas comerciais."
        }
    ];

    return (
        <section id="suporte" className="w-full bg-slate-800 py-32 px-6">
            <div className="max-w-4xl mx-auto text-center">

                <h2 className="text-5xl font-bold drop-shadow flex items-center justify-center gap-4 mb-8">
                    <MessageSquare size={48} className="text-green-400" />
                    <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent leading-snug">
                Dúvidas Frequentes (FAQ)
            </span>
                </h2>

                <p className="max-w-2xl mx-auto text-xl text-slate-300 leading-relaxed mb-16">
                    Tem alguma pergunta? Confira nossa lista de dúvidas frequentes para encontrar a resposta que você procura.
                </p>

                <div className="space-y-6 text-left">
                    {faqItems.map((item, index) => (
                        <div key={index} className="bg-slate-900 p-8 rounded-lg border-l-4 border-blue-500">

                            <h4 className="text-xl font-semibold text-green-400 mb-3">{item.question}</h4>
                            <p className="text-slate-300 leading-relaxed">{item.answer}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}