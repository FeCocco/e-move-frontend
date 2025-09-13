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
        <section id="inicio" className="w-full min-h-screen text-white relative">
            <div className="absolute inset-0 z-10 pointer-events-none"></div>

            <div className="relative z-20 w-full">
                <div className="min-h-screen flex justify-center items-center p-4">

                    <div className="flex flex-col items-center text-center max-w-[80%] font-josefin-sans">
                        <Logo className="text-[5.5vmin] font-bold tracking-widest mb-5 text-azul-claro drop-shadow-[0_0_8px_rgba(0,255,255,0.4)]" />
                        <p className="text-[2.8vmin] mb-7 text-white/70">
                            Planejamento Inteligente para a sua Jornada Elétrica
                        </p>
                        <button
                            className="font-josefin-sans bg-azul-claro text-[#1a1a1a] py-3 px-8 text-[2.5vmin] uppercase rounded-full tracking-wider shadow-[0_5px_15px_rgba(0,255,255,0.3)] transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,255,255,0.5)] mb-7"
                            onClick={handleStart}
                        >
                            Iniciar Jornada
                        </button>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default TelaInicial;