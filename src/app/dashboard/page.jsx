'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardNav from '@/components/DashboardNav/DashboardNav';
import { AnimatePresence, motion } from 'framer-motion';
import { jwtDecode } from 'jwt-decode';

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState('#BemVindo');
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('e-move-token');
        if (!token) {
            router.push('/');
            return;
        }

        const decodedToken = jwtDecode(token);
        setUser(decodedToken);

        const fetchProfile = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/usuario/me', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Falha ao buscar dados do perfil. Token pode ser inválido.');
                }

                const data = await response.json();
                setProfileData(data);
            } catch (error) {
                console.error(error);
                localStorage.removeItem('e-move-token');
                router.push('/');
            }
        };

        fetchProfile();

    }, [router]);

    if (!user || !profileData) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-white text-2xl">Carregando...</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl h-[calc(100vh-80px)] p-6 bg-white/[.08] backdrop-blur-md border-white/20 shadow-lg rounded-2xl text-texto-claro overflow-hidden flex flex-col">
            <h1 className="text-3xl font-bold font-orbitron text-azul-claro text-center mb-2">
                Painel de Controle e-Move
            </h1>

            <div className="flex justify-center mb-8">
                <DashboardNav activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            <div className="flex-grow overflow-y-auto p-4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === '#BemVindo' && (
                            <div className="">
                                <h1 className="text-3xl font-bold font-orbitron text-center mb-20">
                                    Bem-vindo(a), {user.nome}!
                                </h1>
                                <p className="">
                                    Esse é o seu menu do aplicativo, sinta-se a vontade para se familiarizar com as abas.
                                </p>
                            </div>
                        )}
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

                        {activeTab === '#AbaUsuarios' && (
                            <div>
                                <h2 className="text-2xl font-orbitron text-verde-claro mb-4">Minha Conta</h2>
                                <div className="bg-black/20 p-4 rounded-lg">
                                    <p><strong>Nome:</strong> {profileData.nome}</p>
                                    <p><strong>Email:</strong> {profileData.email}</p>
                                    <p><strong>Telefone:</strong> {profileData.telefone}</p>
                                    <p><strong>CPF:</strong> {profileData.cpf}</p>
                                    <p><strong>Sexo:</strong> {profileData.sexo}</p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}