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

// Contextos
import { VeiculosProvider } from '@/context/VeiculosContext';
import { ViagensProvider } from '@/context/ViagensContext';

// ============================================================================
// VALIDAÇÃO ZOD (O CÓDIGO QUE ESTAVA FALTANDO)
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
        <main className="min-h-screen w-full flex flex-col items-center p-2 sm:p-6">
            <VeiculosProvider>
                <ViagensProvider>

                    <div className="w-full max-w-7xl flex flex-col h-full gap-6">

                        {/* CABEÇALHO FLUTUANTE LIMPO */}
                        <header className="flex flex-col items-center justify-center relative mt-2 sm:mt-0">
                            {/* Navegação Centralizada */}
                            <DashboardNav activeTab={activeTab} setActiveTab={setActiveTab} />
                        </header>

                        <div className="flex-grow w-full fade-in-up">

                            <div style={{ display: activeTab === '#BemVindo' ? 'block' : 'none' }}>
                                <BemVindo profileData={profileData} />
                            </div>

                            <div style={{ display: activeTab === '#AbaVeiculos' ? 'block' : 'none' }}>
                                <AbaVeiculos />
                            </div>

                            <div style={{ display: activeTab === '#AbaRotas' ? 'block' : 'none' }}>
                                <AbaRotas setActiveTab={setActiveTab} />
                            </div>

                            <div style={{ display: activeTab === '#AbaEstacoes' ? 'block' : 'none' }}>
                                <AbaEstacoes />
                            </div>

                            <div style={{ display: activeTab === '#AbaMapa' ? 'block' : 'none' }}>
                                <div className="min-h-[500px]">
                                    <AbaMapa isVisible={activeTab === '#AbaMapa'} />
                                </div>
                            </div>

                            <div style={{ display: activeTab === '#AbaUsuarios' ? 'block' : 'none' }}>
                                <AbaUsuarios profileData={profileData} isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} formStatus={formStatus} handleLogout={handleLogout} handleSubmit={handleSubmit} EditarUsuarioSubmit={EditarUsuarioSubmit} register={register} errors={errors} apiError={apiError} />
                            </div>

                            <div style={{ display: activeTab === '#AbaRelatorio' ? 'block' : 'none' }}>
                                <AbaRelatorio />
                            </div>

                        </div>
                    </div>

                </ViagensProvider>
            </VeiculosProvider>
        </main>
    );
}