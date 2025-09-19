"use client";

import { Mail, Phone } from 'lucide-react';

export default function Footer() {
    return (
        <footer id="contato" className="w-full bg-slate-900 pt-24 pb-12 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="w-full h-px bg-blue-500/20 mb-24"></div>
                <div className="text-center">

                    <h2 className="text-5xl font-bold drop-shadow flex items-center justify-center gap-4 mb-6">
                        <Mail size={48} className="text-green-400" />
                        <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent leading-snug">
                    Entre em Contato
                </span>
                    </h2>

                    <p className="max-w-md mx-auto text-lg text-slate-300 mb-8">
                        Gostou do projeto? Quer saber mais ou se tornar um parceiro? Fale conosco!
                    </p>
                    <a href="mailto:emovesuporte@gmail.com" className="text-xl font-semibold text-green-400 hover:underline">
                        emovesuporte@gmail.com
                    </a>

                    <div className="flex justify-center gap-8 my-10">
                        <a href="mailto:emovesuporte@gmail.com" aria-label="Enviar e-mail" className="text-slate-400 hover:text-green-400 transition-colors">
                            <Mail size={32} />
                        </a>
                        <a href="tel:+5519999999999" aria-label="Ligar" className="text-slate-400 hover:text-green-400 transition-colors">
                            <Phone size={32} />
                        </a>
                    </div>

                    <p className="text-slate-500 text-sm">
                        © {new Date().getFullYear()} e-Move. Licença ainda a ser definida.
                    </p>
                </div>
            </div>
        </footer>
    );
}