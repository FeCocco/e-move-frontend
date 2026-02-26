'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DashboardNav from '@/components/DashboardNav/DashboardNav';
import { getApiErrorMessage } from '@/lib/errorHandler';
import { formatarTelefone } from "@/lib/utils";
import api, {deletarUsuario} from '@/lib/api';
import AbaVeiculos from '@/components/AbasDashboard/AbaVeiculos';
import AbaRotas from '@/components/AbasDashboard/AbaRotas';
import AbaEstacoes from '@/components/AbasDashboard/AbaEstacoes';
import AbaMapa from '@/components/AbasDashboard/AbaMapa';
import AbaRelatorio from '@/components/AbasDashboard/AbaRelatorio';
import AbaUsuarios from '@/components/AbasDashboard/AbaUsuarios';
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
    if (data.senha && data.senha !== "") {
        return data.senha === data.confirmar_senha;
    }
    return true;
}, {
    message: "As senhas não coincidem",
    path: ["confirmar_senha"],
});

function DashboardSkeleton() {
    return (
        <main className="min-h-screen w-full flex flex-col items-center p-2 sm:p-6">
            <div className="w-full max-w-7xl flex flex-col h-full gap-6 animate-pulse">
                <header className="flex flex-col items-center justify-center relative mt-2 sm:mt-0">
                    <div className="h-12 w-full max-w-[520px] rounded-full bg-white/10" />
                </header>

                <div className="flex-grow w-full">
                    <div className="bg-black/20 border border-white/10 rounded-xl p-6">
                        <div className="h-6 w-44 rounded-md bg-white/10 mb-6" />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="h-40 rounded-xl bg-white/5 border border-white/10" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function DashboardPage() {
    // REMOVIDO: const API_URL = ... (Causa do erro)
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
            const response = await api.put('/usuario/me', dadosParaEnviar);

            const updatedProfile = response.data;
            setProfileData(updatedProfile);
            setFormStatus('success');
            setTimeout(() => {
                setIsDialogOpen(false);
                setFormStatus('idle');
            }, 2000);
        } catch (error) {
            const msg = error.response?.data || error.message || 'Falha ao atualizar.';
            setApiError(getApiErrorMessage(msg));
            setFormStatus('idle');
        }
    };

    const handleLogout = async () => {
        try {
            await api.post('/logout');
        } catch (error) {
            console.error(error);
        } finally {
            localStorage.removeItem('e-move-token');
            router.push('/');
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await deletarUsuario();
            localStorage.removeItem('e-move-token');
            router.push('/');
        } catch (error) {
            console.error("Erro ao solicitar exclusão da conta:", error);
            const msg = error.response?.data || error.message || 'Erro ao excluir conta.';
            setApiError(getApiErrorMessage(msg));
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/usuario/me');
                const data = response.data;

                setProfileData(data);
                setValue('nome', data.nome);
                setValue('email', data.email);
                setValue('telefone', formatarTelefone(data.telefone));

            } catch (error) {
                console.error("Erro ao carregar perfil:", error);
                router.push('/');
            }
        };
        fetchProfile();
    }, [router, setValue]);

    if (!profileData) {
        return <DashboardSkeleton />;
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

                                <div style={{ display: activeTab === '#AbaVeiculos' ? 'block' : 'none' }}>
                                    <AbaVeiculos />
                                </div>

                                <div style={{ display: activeTab === '#AbaRotas' ? 'block' : 'none' }}>
                                    <AbaRotas setActiveTab={setActiveTab} />
                                </div>

                                <div style={{ display: activeTab === '#AbaEstacoes' ? 'block' : 'none' }}>
                                    <AbaEstacoes isActive={activeTab === '#AbaEstacoes'} />
                                </div>

                                <div style={{ display: activeTab === '#AbaMapa' ? 'block' : 'none' }}>
                                    <div className="min-h-[500px]">
                                        <AbaMapa isVisible={activeTab === '#AbaMapa'} />
                                    </div>
                                </div>

                                <div style={{ display: activeTab === '#AbaUsuarios' ? 'block' : 'none' }}>
                                    <AbaUsuarios
                                        profileData={profileData}
                                        isDialogOpen={isDialogOpen}
                                        setIsDialogOpen={setIsDialogOpen}
                                        formStatus={formStatus}
                                        handleLogout={handleLogout}
                                        handleDeleteAccount={handleDeleteAccount}
                                        handleSubmit={handleSubmit}
                                        EditarUsuarioSubmit={EditarUsuarioSubmit}
                                        register={register}
                                        errors={errors}
                                        apiError={apiError}
                                        control={control}
                                    />
                                </div>

                                <div style={{ display: activeTab === '#AbaRelatorio' ? 'block' : 'none' }}>
                                    <AbaRelatorio />
                                </div>

                            </div>
                        </div>

                    </EstacoesProvider>
                </ViagensProvider>
            </VeiculosProvider>
        </main>
    );
}