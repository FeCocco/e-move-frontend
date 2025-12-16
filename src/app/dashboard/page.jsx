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
import { formatarTelefone } from "@/lib/utils";

// Abas do Dashboard
import AbaVeiculos from '@/components/AbasDashboard/AbaVeiculos';
import AbaRotas from '@/components/AbasDashboard/AbaRotas';
import AbaEstacoes from '@/components/AbasDashboard/AbaEstacoes';
import AbaMapa from '@/components/AbasDashboard/AbaMapa';
import AbaRelatorio from '@/components/AbasDashboard/AbaRelatorio';
import AbaUsuarios from '@/components/AbasDashboard/AbaUsuarios';

// Contextos
import { VeiculosProvider } from '@/context/VeiculosContext';
import { ViagensProvider } from '@/context/ViagensContext';
import { EstacoesProvider } from '@/context/EstacoesContext';

// ============================================================================
// VALIDAÇÃO ZOD
// ============================================================================
const EditarUsuarioSchema = z.object({
    nome: z.string().min(3, { message: "O nome deve ter no mínimo 3 caracteres." }),
    email: z.email({ message: "Formato de e-mail inválido." }),
    telefone: z.string()
        .min(14, { message: "O telefone parece incompleto." })
        .max(15, { message: "Telefone inválido." }),
    sexo: z.string().nonempty("O gênero é obrigatório."),
    senha: z.string().optional(),
    confirmar_senha: z.string().optional()
}).refine((data) => {
    //confirmação deve ser igual
    if (data.senha && data.senha !== "") {
        return data.senha === data.confirmar_senha;
    }
    return true;
}, {
    message: "As senhas não coincidem",
    path: ["confirmar_senha"],
});

// ============================================================================
// COMPONENTE DA PÁGINA DE DASHBOARD
// ============================================================================
export default function DashboardPage() {
    const API_URL = 'http://localhost:8080/api';
    const router = useRouter();

    const [activeTab, setActiveTab] = useState('#AbaRelatorio');
    const [profileData, setProfileData] = useState(null);
    const [apiError, setApiError] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formStatus, setFormStatus] = useState('idle');

    const { register, handleSubmit, control, formState: { errors }, setValue } = useForm({
        resolver: zodResolver(EditarUsuarioSchema),
        mode: "onBlur",
    });

    const EditarUsuarioSubmit = async (data) => {
        setApiError('');
        setFormStatus('submitting');

        const dadosParaEnviar = {
            ...data,
            telefone: data.telefone.replace(/\D/g, ''),
        };

        if (!data.senha) {
            delete dadosParaEnviar.senha;
            delete dadosParaEnviar.confirmar_senha;
        } else {
            delete dadosParaEnviar.confirmar_senha;
        }

        try {
            const token = localStorage.getItem("e-move-token");
            if (!token) throw new Error("Token não encontrado.");

            const response = await fetch(`${API_URL}/usuario/me`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                cache: 'no-store',
                body: JSON.stringify(dadosParaEnviar),
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
            });
        } catch (error) {
            console.error("Erro ao fazer logout no servidor:", error);
        } finally {
            localStorage.removeItem("e-move-token");
            router.push('/');
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("e-move-token");
                if (!token) throw new Error('Token não encontrado.');

                const response = await fetch(`${API_URL}/usuario/me`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    cache: 'no-store'
                });
                if (!response.ok) throw new Error('Sessão inválida ou expirada.');
                const data = await response.json();
                setProfileData(data);

                setValue('nome', data.nome);
                setValue('email', data.email);
                setValue('telefone', formatarTelefone(data.telefone));

            } catch (error) {
                console.error(error);
                localStorage.removeItem("e-move-token");
                router.push('/');
            }
        };
        fetchProfile();
    }, [router, setValue]);

    if (!profileData) {
        return (
            <div className="flex justify-center items-center h-screen bg-zinc-950">
                <p className="text-white text-xl animate-pulse">Carregando perfil...</p>
            </div>
        );
    }

    return (
        <main className="min-h-screen w-full flex flex-col items-center p-2 sm:p-6">
            <VeiculosProvider>
                <ViagensProvider>
                    <EstacoesProvider>

                        <div className="w-full max-w-7xl flex flex-col h-full gap-6">

                            <header className="flex flex-col items-center justify-center relative mt-2 sm:mt-0">
                                <DashboardNav activeTab={activeTab} setActiveTab={setActiveTab} />
                            </header>

                            <div className="flex-grow w-full fade-in-up">

                                {/* MUDANÇA: Renderização Condicional para evitar erros de Chart width(0) */}

                                {activeTab === '#AbaVeiculos' && <AbaVeiculos />}

                                {activeTab === '#AbaRotas' && <AbaRotas setActiveTab={setActiveTab} />}

                                {activeTab === '#AbaEstacoes' && <AbaEstacoes />}

                                <div
                                    className="min-h-[500px]"
                                    style={{ display: activeTab === '#AbaMapa' ? 'block' : 'none' }}
                                >
                                    <AbaMapa isVisible={activeTab === '#AbaMapa'} />
                                </div>

                                {activeTab === '#AbaUsuarios' && (
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
                                        control={control}
                                    />
                                )}

                                {activeTab === '#AbaRelatorio' && <AbaRelatorio />}

                            </div>
                        </div>

                    </EstacoesProvider>
                </ViagensProvider>
            </VeiculosProvider>
        </main>
    );
}