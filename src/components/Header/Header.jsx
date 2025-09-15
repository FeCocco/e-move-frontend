"use client";
import { Link as ScrollLink } from 'react-scroll';
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    // Este estado garante que a classe de transição só seja aplicada no navegador.
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        // Assim que o componente é montado no navegador, ativamos o estado.
        setIsMounted(true);
    }, []);

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
            {/* Botão do Menu Hambúrguer (sem alterações) */}
            <button
                onClick={toggleMenu}
                className="fixed top-8 right-8 z-[1200] w-8 h-6 flex flex-col justify-between items-center cursor-pointer"
                aria-label="Abrir menu"
            >
                <span className={cn("block w-full h-0.5 bg-texto-claro rounded-full transition-transform duration-300 ease-in-out", { "transform rotate-45 translate-y-[11px]": menuOpen })}></span>
                <span className={cn("block w-full h-0.5 bg-texto-claro rounded-full transition-opacity duration-300 ease-in-out", { "opacity-0": menuOpen })}></span>
                <span className={cn("block w-full h-0.5 bg-texto-claro rounded-full transition-transform duration-300 ease-in-out", { "transform -rotate-45 -translate-y-[11px]": menuOpen })}></span>
            </button>

            {/* Fundo escurecido (Backdrop) (sem alterações) */}
            <div
                onClick={closeMenu}
                className={cn(
                    "fixed inset-0 z-[1099] bg-black/60 backdrop-blur-sm transition-opacity duration-300",
                    menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
            ></div>

            {/* Painel do Menu Lateral com a correção definitiva */}
            <nav
                className={cn(
                    "fixed top-0 h-full right-0 w-[280px] z-[1100] bg-slate-900 shadow-lg flex flex-col items-center pt-28 gap-4",
                    // Começa escondido por padrão, sem transição.
                    "translate-x-full",
                    // A classe de transição só é aplicada DEPOIS da montagem no cliente.
                    isMounted && "transition-transform duration-400 ease-in-out",
                    // A classe para mostrar o menu é aplicada quando o estado muda.
                    menuOpen && "translate-x-0"
                )}
            >
                <li onClick={closeMenu} className="text-slate-300 hover:text-white cursor-pointer transition text-lg font-semibold py-2 list-none">
                    <ScrollLink to="inicio" spy={true} smooth={true} offset={-90} duration={500} onClick={closeMenu}>Início</ScrollLink>
                </li>
                <li onClick={closeMenu} className="text-slate-300 hover:text-white cursor-pointer transition text-lg font-semibold py-2 list-none">
                    <ScrollLink to="sobre-nos" spy={true} smooth={true} offset={-90} duration={500} onClick={closeMenu}>Sobre Nós</ScrollLink>
                </li>
                <li onClick={closeMenu} className="text-slate-300 hover:text-white cursor-pointer transition text-lg font-semibold py-2 list-none">
                    <ScrollLink to="inovacao" spy={true} smooth={true} offset={-90} duration={500} onClick={closeMenu}>Inovação</ScrollLink>
                </li>
                <li onClick={closeMenu} className="text-slate-300 hover:text-white cursor-pointer transition text-lg font-semibold py-2 list-none">
                    <ScrollLink to="suporte" spy={true} smooth={true} offset={-90} duration={500} onClick={closeMenu}>Suporte</ScrollLink>
                </li>
                <li onClick={closeMenu} className="text-slate-300 hover:text-white cursor-pointer transition text-lg font-semibold py-2 list-none">
                    <ScrollLink to="contato" spy={true} smooth={true} offset={-90} duration={500} onClick={closeMenu}>Contato</ScrollLink>
                </li>
            </nav>
        </>
    );
}