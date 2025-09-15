"use client";
import { Link as ScrollLink } from 'react-scroll';
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [menuOpen]);

    const toggleMenu = () => setMenuOpen(!menuOpen);
    const closeMenu = () => setMenuOpen(false);

    return (
        <>
            {/* Botão do Menu Hambúrguer Flutuante */}
            <button
                onClick={toggleMenu}
                className="fixed top-8 right-8 z-[1200] w-8 h-6 flex flex-col justify-between items-center cursor-pointer"
                aria-label="Abrir menu"
            >
                <span className={cn("block w-full h-0.5 bg-texto-claro rounded-full transition-transform duration-300 ease-in-out", { "transform rotate-45 translate-y-[11px]": menuOpen })}></span>
                <span className={cn("block w-full h-0.5 bg-texto-claro rounded-full transition-opacity duration-300 ease-in-out", { "opacity-0": menuOpen })}></span>
                <span className={cn("block w-full h-0.5 bg-texto-claro rounded-full transition-transform duration-300 ease-in-out", { "transform -rotate-45 -translate-y-[11px]": menuOpen })}></span>
            </button>

            {/* Fundo escurecido (Backdrop) */}
            <div
                onClick={closeMenu}
                className={cn(
                    "fixed inset-0 z-[1099] bg-black/60 backdrop-blur-sm transition-opacity duration-300",
                    menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
            ></div>

            {/* Painel do Menu Lateral (Nav) */}
            <nav
                className={cn(
                    "fixed top-0 h-full right-0 w-[280px] z-[1100] bg-slate-900 shadow-lg flex flex-col items-center pt-28 gap-4 transition-transform duration-400 ease-in-out",
                    menuOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                {/* Links do menu */}
                <li className="list-none"><ScrollLink to="inicio" spy={true} smooth={true} offset={-90} duration={500} onClick={closeMenu} className="text-slate-300 hover:text-white cursor-pointer transition text-lg font-semibold py-2">Início</ScrollLink></li>
                <li className="list-none"><ScrollLink to="sobre-nos" spy={true} smooth={true} offset={-90} duration={500} onClick={closeMenu} className="text-slate-300 hover:text-white cursor-pointer transition text-lg font-semibold py-2">Sobre Nós</ScrollLink></li>
                <li className="list-none"><ScrollLink to="inovacao" spy={true} smooth={true} offset={-90} duration={500} onClick={closeMenu} className="text-slate-300 hover:text-white cursor-pointer transition text-lg font-semibold py-2">Inovação</ScrollLink></li>
                <li className="list-none"><ScrollLink to="suporte" spy={true} smooth={true} offset={-90} duration={500} onClick={closeMenu} className="text-slate-300 hover:text-white cursor-pointer transition text-lg font-semibold py-2">Suporte</ScrollLink></li>
                <li className="list-none"><ScrollLink to="contato" spy={true} smooth={true} offset={-90} duration={500} onClick={closeMenu} className="text-slate-300 hover:text-white cursor-pointer transition text-lg font-semibold py-2">Contato</ScrollLink></li>
            </nav>
        </>
    );
}