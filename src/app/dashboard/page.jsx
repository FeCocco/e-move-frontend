'use client';
import { useState } from 'react';
import DashboardNav from '@/components/DashboardNav/DashboardNav';
import { AnimatePresence, motion } from 'framer-motion';

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState('#tabVehicles');

    return (
        <div className="w-full max-w-6xl h-[calc(100vh-80px)] p-6 bg-white/[.08] backdrop-blur-md border-white/20 shadow-lg rounded-2xl text-texto-claro overflow-hidden flex flex-col">
            <h1 className="text-3xl font-bold font-orbitron text-azul-claro text-center mb-6">
                Painel de Controle e-Move
            </h1>

            <div className="flex justify-center mb-8">
                <DashboardNav activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            <div className="flex-grow overflow-y-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === '#AbaVeiculos' && (
                            <div>
                                <h2 className="text-2xl font-orbitron text-verde-claro mb-4">Meus Veículos</h2>
                                <p>Conteúdo da aba de veículos aqui...</p>
                            </div>
                        )}
                        {activeTab === '#AbaRotas' && (
                            <div>
                                <h2 className="text-2xl font-orbitron text-verde-claro mb-4">Minhas Rotas</h2>
                                <p>Conteúdo da aba de rotas aqui...</p>
                            </div>
                        )}
                        {activeTab === '#AbaEstacoes' && <p>Conteúdo de Estações...</p>}
                        {activeTab === '#AbaMapa' && <p>Conteúdo de Planejar Rota...</p>}
                        {activeTab === '#AbaUsuarios' && <p>Conteúdo de Conta...</p>}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}