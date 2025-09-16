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
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppCard } from "@/components/AppCard/AppCard";
import DashboardNav from '@/components/DashboardNav/DashboardNav';

// Utilitários e Gráficos
import { getApiErrorMessage } from '@/lib/errorHandler';
import VeiculoChart from '@/components/Charts/VeiculoChart';
import PostoChart from '@/components/Charts/PostoChart';
import RotasChart from '@/components/Charts/RotasChart';
import SatisfacaoChart from '@/components/Charts/SatisfacaoChart';
import StatCard from '@/components/Charts/StatCard';
import AnimatedCar from '@/components/Charts/AnimatedCar';
import { Route, Zap, Droplets, UserRoundPen, LogOut, Check } from 'lucide-react';

// ============================================================================
// SCHEMA DE VALIDAÇÃO (ZOD)
// ============================================================================
const EditarUsuarioSchema = z.object({
    nome: z.string().min(3, { message: "O nome deve ter no mínimo 3 caracteres." }),
    email: z.email({ message: "Formato de e-mail inválido." }),
    telefone: z.string()
        .regex(/^\d+$/, { message: "O telefone deve conter apenas números." })
        .min(10, { message: "O telefone deve ter no mínimo 10 dígitos." })
        .max(11, { message: "O telefone não pode ter mais de 11 dígitos." }),
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

    return (
        <div className="flex items-center justify-center w-full min-h-screen p-4 md:p-6">
            <div className="w-full max-w-6xl h-[calc(100vh-80px)] p-6 bg-white/[.08] backdrop-blur-md border-white/20 shadow-lg rounded-2xl text-texto-claro overflow-hidden flex flex-col">
                <h1 className="text-3xl font-bold font-orbitron text-azul-claro text-center mb-7">
                    Painel de Controle e-Move
                </h1>

                <div className="flex justify-center mb-8">
                    <DashboardNav activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>

                <div className="flex-grow overflow-y-auto p-4">
                    <AnimatePresence mode="wait">
                        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>

                            {activeTab === '#BemVindo' && (
                                <div className="text-center">
                                    <h1 className="text-3xl font-bold font-orbitron mb-4">Bem-vindo(a), {profileData.nome}!</h1>
                                    <p className="text-texto-claro/80">Esse é o seu menu do aplicativo, sinta-se a vontade para se familiarizar com as abas.</p>
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
                                    <div className="flex justify-center">
                                        <AppCard className="bg-black/20 p-6 rounded-lg w-full max-w-md text-left">
                                            <p className="mb-2"><strong>Nome:</strong> {profileData.nome}</p>
                                            <p className="mb-2"><strong>Email:</strong> {profileData.email}</p>
                                            <p className="mb-2"><strong>Telefone:</strong> {profileData.telefone}</p>
                                            <p className="mb-2"><strong>CPF:</strong> {profileData.cpf}</p>
                                            <p><strong>Sexo:</strong> {profileData.sexo}</p>
                                            <div className="p-4 flex justify-center">
                                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline"><UserRoundPen /> Editar Meus Dados</Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-[425px]">
                                                        {formStatus === 'success' ? (
                                                            <div className="flex flex-col items-center justify-center p-8 h-48">
                                                                <Check size={48} className="text-verde-claro mb-4"/>
                                                                <DialogTitle className="text-xl">Perfil Atualizado!</DialogTitle>
                                                                <DialogDescription>
                                                                    Seus dados foram salvos com sucesso.
                                                                </DialogDescription>
                                                            </div>
                                                        ) : (
                                                            <form onSubmit={handleSubmit(EditarUsuarioSubmit)}>
                                                                <DialogHeader>
                                                                    <DialogTitle>Editar Perfil</DialogTitle>
                                                                    <DialogDescription>
                                                                        Faça suas modificações aqui e salve quando tiver finalizado.
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                                <div className="grid gap-4 py-4">
                                                                    <div className="grid gap-2">
                                                                        <Label htmlFor="edit_nome">Nome</Label>
                                                                        <Input id="edit_nome" {...register("nome")} defaultValue={profileData.nome} />
                                                                        {errors.nome && <p className="text-vermelho-status text-xs mt-1">{errors.nome.message}</p>}
                                                                    </div>
                                                                    <div className="grid gap-2">
                                                                        <Label htmlFor="edit_email">E-mail</Label>
                                                                        <Input id="edit_email" {...register("email")} defaultValue={profileData.email} />
                                                                        {errors.email && <p className="text-vermelho-status text-xs mt-1">{errors.email.message}</p>}
                                                                    </div>
                                                                    <div className="grid gap-2">
                                                                        <Label htmlFor="edit_telefone">Telefone</Label>
                                                                        <Input id="edit_telefone" {...register("telefone")} defaultValue={profileData.telefone} />
                                                                        {errors.telefone && <p className="text-vermelho-status text-xs mt-1">{errors.telefone.message}</p>}
                                                                    </div>
                                                                </div>
                                                                {apiError && <p className="text-vermelho-status text-center text-sm mb-2">{apiError}</p>}
                                                                <DialogFooter>
                                                                    <DialogClose asChild>
                                                                        <Button variant="outline" type="button">Cancelar</Button>
                                                                    </DialogClose>
                                                                    <Button
                                                                        type="submit"
                                                                        className="underline hover:text-verde-claro"
                                                                        disabled={formStatus === 'submitting'}
                                                                    >
                                                                        {formStatus === 'submitting' ? 'Salvando...' : 'Salvar'}
                                                                    </Button>
                                                                </DialogFooter>
                                                            </form>
                                                        )}
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </AppCard>
                                    </div>
                                    <div className="text-center mt-6">
                                         <button onClick={handleLogout} className="inline-flex itens-center gap-2 text-azul-claro/80 hover:text-azul-claro hover:underline transition-colors"><LogOut   />Sair da Conta</button>
                                    </div>
                                </div>
                            )}

                            {activeTab === '#AbaRelatorio' && (
                                <div>
                                    <h2 className="text-2xl font-orbitron text-verde-claro mb-2 text-center">Meus Relatórios</h2>
                                    <p className="text-texto-claro/80 mb-8 text-center">Visualize os dados e métricas de uso do seu aplicativo e-Move.</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="bg-black/20 p-6 rounded-lg">
                                            <h3 className="text-lg font-semibold text-azul-claro mb-4 text-center">Veículos Mais Utilizados</h3>
                                            <VeiculoChart />
                                        </div>

                                        <div className="bg-black/20 p-6 rounded-lg flex flex-col">
                                            <h3 className="text-lg font-semibold text-azul-claro mb-4 text-center">Satisfação e Resumo</h3>
                                            <div className="flex-grow mb-6">
                                                <SatisfacaoChart />
                                            </div>

                                            <div className="grid grid-cols-3 gap-4 mb-6">
                                                <StatCard icon={Route} value="1.280" unit="km" label="Distância Percorrida" />
                                                <StatCard icon={Zap} value="256" unit="kWh" label="Energia Consumida" />
                                                <StatCard icon={Droplets} value="1.152" unit="kg" label="CO₂ Economizado" />
                                            </div>
                                            <div className="mt-auto">
                                                <AnimatedCar />
                                            </div>
                                        </div>
                                        <div className="bg-black/20 p-6 rounded-lg">
                                            <h3 className="text-lg font-semibold text-azul-claro mb-4 text-center">Rotas Preferidas</h3>
                                            <RotasChart />
                                        </div>
                                        <div className="bg-black/20 p-6 rounded-lg">
                                            <h3 className="text-lg font-semibold text-azul-claro mb-4 text-center">Postos de Recarga Frequentes</h3>
                                            <PostoChart />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}