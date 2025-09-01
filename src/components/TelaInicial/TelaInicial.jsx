'use client';
import React from 'react';
import Logo from '../Logo/Logo';
import { useRouter } from 'next/navigation';

const TelaInicial = () => {
    const router = useRouter();

    const handleStart = () => {
        router.push('/login');
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center z-[100] text-white bg-gradient-body">
            <div className="absolute w-full h-full bg-black/30 z-10"></div>
            <div className="relative text-center z-20 max-w-[80%] font-josefin-sans pb-5 animate-welcome-fade-in opacity-0">
                <Logo className="text-[5.5vmin] font-bold tracking-widest mb-5 text-azul-claro drop-shadow-[0_0_8px_rgba(0,255,255,0.4)]" />
                <p className="text-[2.8vmin] mb-7 text-white/70">
                    Planejamento Inteligente para a sua Jornada Elétrica
                </p>
                <button
                    className="font-josefin-sans bg-azul-claro text-[#1a1a1a] py-3 px-8 text-[2.5vmin] uppercase border-none rounded-full cursor-pointer tracking-wider shadow-[0_5px_15px_rgba(0,255,255,0.3)] transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,255,255,0.5)] mb-7"
                    onClick={handleStart}
                >
                    Iniciar Jornada
                </button>
            </div>
        </div>
    );
}; export default TelaInicial;