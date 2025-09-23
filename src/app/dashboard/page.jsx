'use client';

// ============================================================================
// IMPORTS
// ============================================================================
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { z } from 'zod';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Componentes da Interface (UI)
import DashboardNav from '@/components/DashboardNav/DashboardNav';

// Utilitários
import { getApiErrorMessage } from '@/lib/errorHandler';

// Abas do Dashboard
import BemVindo from '@/components/AbasDashboard/BemVindo';
import AbaVeiculos from '@/components/AbasDashboard/AbaVeiculos';
import AbaRotas from '@/components/AbasDashboard/AbaRotas';
import AbaEstacoes from '@/components/AbasDashboard/AbaEstacoes';
import AbaMapa from '@/components/AbasDashboard/AbaMapa';
import AbaRelatorio from '@/components/AbasDashboard/AbaRelatorio';
import AbaUsuarios from '@/components/AbasDashboard/AbaUsuarios';
import {AppCard} from "@/components/AppCard/AppCard";
import Logo from "@/components/Logo/Logo";



// ============================================================================
// SCHEMA DE VALIDAÇÃO (ZOD)
// ============================================================================
const EditarUsuarioSchema = z.object({
    nome: z.string().min(3, { message: "O nome deve ter no mínimo 3 caracteres." }),
    email: z.email({ message: "Formato de e-mail inválido." }),
    telefone: z.string()
        .regex(/^\d+$/, { message: "O telefone deve conter apenas números." })
        .min(10, { message: "O telefone não pode ter mais de 11 dígitos." }),
});

// ============================================================================
// COMPONENTE DA PÁGINA DE DASHBOARD
// ============================================================================
export default function DashboardPage() {
    const API_URL = 'http://localhost:8080/api';
    const router = useRouter();

    // Estados para controle da UI e dados
    const [activeTab, setActiveTab] = useState('#BemVindo');
    const [profileData, setProfileData] = useState(null);
    const [apiError, setApiError] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formStatus, setFormStatus] = useState('idle');

    // Hooks para gerenciamento de formulário
    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: zodResolver(EditarUsuarioSchema),
        mode: "onBlur",
    });

    // Função para submeter a edição de dados do usuário
    const EditarUsuarioSubmit = async (data) => {
        setApiError('');
        setFormStatus('submitting');
        try {
            const response = await fetch(`${API_URL}/usuario/me`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                cache: 'no-store',
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Falha ao atualizar.');
            }
            const updatedProfile = await response.json();
            setProfileData(updatedProfile);
            setFormStatus('success');
            setTimeout(() => {
                setIsDialogOpen(false);
                setFormStatus('idle');
            }, 2000);
        } catch (error) {
            setApiError(getApiErrorMessage(error.message));
            setFormStatus('idle');
        }
    };

    // Função para realizar o logout do usuário
    const handleLogout = async () => {
        try {
            await fetch(`${API_URL}/logout`, {
                method: 'POST',
                credentials: 'include',
            });
        } catch (error) {
            console.error("Erro ao fazer logout no servidor:", error);
        } finally {
            router.push('/');
        }
    };

    // Efeito para buscar os dados do perfil ao carregar a página
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`${API_URL}/usuario/me`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    cache: 'no-store'
                });
                if (!response.ok) throw new Error('Sessão inválida ou expirada.');
                const data = await response.json();
                setProfileData(data);
                // Preenche o formulário de edição com os dados buscados
                setValue('nome', data.nome);
                setValue('email', data.email);
                setValue('telefone', data.telefone);
            } catch (error) {
                console.error(error);
                router.push('/');
            }
        };
        fetchProfile();
    }, [router, setValue]);

    // Renderiza uma tela de carregamento enquanto os dados do perfil são buscados
    if (!profileData) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-white text-2xl">Verificando sessão...</p>
            </div>
        );
    }

    const renderContent = () => {
        switch (activeTab) {
            case '#BemVindo':
                return <BemVindo profileData={profileData} />;
            case '#AbaVeiculos':
                return <AbaVeiculos />;
            case '#AbaRotas':
                return <AbaRotas />;
            case '#AbaEstacoes':
                return <AbaEstacoes />;
            case '#AbaMapa':
                return <AbaMapa />;
            case '#AbaUsuarios':
                return <AbaUsuarios
                    profileData={profileData}
                    isDialogOpen={isDialogOpen}
                    setIsDialogOpen={setIsDialogOpen}
                    formStatus={formStatus}
                    handleLogout={handleLogout}
                    handleSubmit={handleSubmit}
                    EditarUsuarioSubmit={EditarUsuarioSubmit}
                    register={register}
                    errors={errors}
                    apiError={apiError}
                />;
            case '#AbaRelatorio':
                return <AbaRelatorio />;
            default:
                return null;
        }
    }

    return (
        <main className="flex flex-grow items-start sm:items-center justify-center p-0 sm:p-4">
            <AppCard className="h-screen sm:h-[90vh] w-full max-w-6xl p-2 sm:p-4 rounded-none sm:rounded-xl border-0 sm:border">
                <div className="sm:hidden text-center mb-4 pt-8">
                    <Logo className="text-4xl inline-block" />
                </div>
                <h1 className="hidden sm:block text-2xl sm:text-3xl font-bold font-orbitron text-azul-claro text-center mb-4 sm:mb-7">
                    Painel de Controle e-Move
                </h1>

                <div className="flex justify-center mb-6 sm:mb-8">
                    <DashboardNav activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>

                <div className="flex-grow overflow-y-auto px-1 py-4 sm:p-4">
                    <AnimatePresence mode="wait">
                        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                            {renderContent()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </AppCard>
        </main>
    );
}