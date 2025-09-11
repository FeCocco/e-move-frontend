"use client";
import { useState } from "react";
import Logo from "../Logo/Logo";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-slate-900/90 backdrop-blur border-b border-blue-500/20">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <a href="/" className="flex items-center">
         
        </a>

        {/* Navegação Desktop */}
        <nav className="hidden md:flex space-x-6 font-semibold items-center">
          <a
            href="#sobre-nos"
            className="text-slate-300 hover:text-white transition"
          >
            Sobre Nós
          </a>
          <a
            href="#inovacao"
            className="text-slate-300 hover:text-white transition"
          >
            Inovação
          </a>
          <a
            href="#suporte"
            className="text-slate-300 hover:text-white transition"
          >
            Suporte
          </a>
          <a
            href="#contato"
            className="px-4 py-2 rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-slate-900 font-bold hover:scale-105 hover:shadow-lg transition"
          >
            Contato
          </a>
        </nav>

        {/* Botão Mobile */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menu"
        >
          ☰
        </button>
      </div>

      {/* Menu Mobile */}
      {menuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-blue-500/20">
          <nav className="flex flex-col items-center py-4 space-y-4">
            <a
              href="#sobre-nos"
              className="text-slate-300 hover:text-white"
              onClick={() => setMenuOpen(false)}
            >
              Sobre Nós
            </a>
            <a
              href="#inovacao"
              className="text-slate-300 hover:text-white"
              onClick={() => setMenuOpen(false)}
            >
              Inovação
            </a>
            <a
              href="#suporte"
              className="text-slate-300 hover:text-white"
              onClick={() => setMenuOpen(false)}
            >
              Suporte
            </a>
            <a
              href="#contato"
              className="px-4 py-2 rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-slate-900 font-bold hover:scale-105 hover:shadow-lg transition"
              onClick={() => setMenuOpen(false)}
            >
              Contato
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
