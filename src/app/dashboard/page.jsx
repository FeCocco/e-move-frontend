'use client';

// ============================================================================
// IMPORTS
// ============================================================================
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import Link from "next/link";

// Contextos
import { VeiculosProvider } from '@/context/VeiculosContext';
import { ViagensProvider } from '@/context/ViagensContext';

// ============================================================================
// VALIDEACAO ZOD
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

    const [activeTab, setActiveTab] = useState('#BemVindo');
    const [profileData, setProfileData] = useState(null);
    const [apiError, setApiError] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formStatus, setFormStatus] = useState('idle');

    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: zodResolver(EditarUsuarioSchema),
        mode: "onBlur",
    });

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

    if (!profileData) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-white text-2xl">Verificando sessão...</p>
            </div>
        );
    }

    return (
        <main className="flex flex-grow items-start sm:items-center justify-center p-0 sm:p-4">
            <VeiculosProvider>
                <ViagensProvider>
                    <AppCard className="h-screen sm:h-[90vh] w-full max-w-6xl p-2 sm:p-4 rounded-none sm:rounded-xl border-0 sm:border bg-transparent sm:bg-white/[0.08]" >
                        <div className="sm:hidden text-center mb-4 pt-8">
                            <Link href="/">
                                <Logo className="text-4xl inline-block text-azul-claro/70 drop-shadow-[0_0_8px_rgba(0,255,255,0.4)]" />
                            </Link>
                        </div>
                        <h1 className="hidden sm:block text-2xl sm:text-3xl font-bold font-orbitron text-azul-claro text-center mb-4 sm:mb-7">
                            Painel de Controle e-Move
                        </h1>

                        <div className="flex justify-center mb-6 sm:mb-8">
                            <DashboardNav activeTab={activeTab} setActiveTab={setActiveTab} />
                        </div>

                        <div className="flex-grow overflow-y-auto px-1 py-4 sm:p-4">

                            <div style={{ display: activeTab === '#BemVindo' ? 'block' : 'none' }}>
                                <BemVindo profileData={profileData} />
                            </div>

                            <div style={{ display: activeTab === '#AbaVeiculos' ? 'block' : 'none' }}>
                                <AbaVeiculos />
                            </div>

                            <div style={{ display: activeTab === '#AbaRotas' ? 'block' : 'none' }}>
                                <AbaRotas />
                            </div>

                            <div style={{ display: activeTab === '#AbaEstacoes' ? 'block' : 'none' }}>
                                <AbaEstacoes />
                            </div>

                            <div style={{ display: activeTab === '#AbaMapa' ? 'block' : 'none' }}>
                                <AbaMapa isVisible={activeTab === '#AbaMapa'} />
                            </div>

                            <div style={{ display: activeTab === '#AbaUsuarios' ? 'block' : 'none' }}>
                                <AbaUsuarios
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
                                />
                            </div>

                            <div style={{ display: activeTab === '#AbaRelatorio' ? 'block' : 'none' }}>
                                <AbaRelatorio />
                            </div>

                        </div>
                    </AppCard>
                </ViagensProvider>
            </VeiculosProvider>
        </main>
    );
}