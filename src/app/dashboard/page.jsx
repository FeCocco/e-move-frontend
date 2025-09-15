'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardNav from '@/components/DashboardNav/DashboardNav';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { z } from 'zod';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getApiErrorMessage } from '@/lib/errorHandler';
import {AppCard} from "@/components/AppCard/AppCard";

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

export default function DashboardPage() {
    const API_URL = 'http://localhost:8080/api';
    const [activeTab, setActiveTab] = useState('#BemVindo');
    const router = useRouter();
    const [profileData, setProfileData] = useState(null);
    const [apiError, setApiError] = useState('');

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formStatus, setFormStatus] = useState('idle'); // 'idle', 'submitting', 'success'

    const { register, handleSubmit, formState: { errors } } = useForm({
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
                router.refresh();
            }, 2000);

        } catch (error) {
            setApiError(getApiErrorMessage(error.message));
            setFormStatus('idle');
        }
    }

    const handleLogout = async () => {
        try {
            await fetch('http://localhost:8080/api/logout', {
                method: 'POST',
                credentials: 'include', // Necessário para que o navegador envie o cookie para o backend
            });
        } catch (error) {
            // Mesmo que a chamada falhe, o redirecionamento deve acontecer
            console.error("Erro ao fazer logout no servidor:", error);
        } finally {
            // Redireciona o usuário para a página inicial após a tentativa de logout
            router.push('/');
        }
    };


    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/usuario/me', {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    cache: 'no-store'
                });

                if (!response.ok) {
                    throw new Error('Sessão inválida ou expirada.');
                }

                const data = await response.json();
                setProfileData(data);

            } catch (error) {
                console.error(error);
                router.push('/');
            }
        };

        fetchProfile();

    }, [router]);

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
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab === '#BemVindo' && (
                                <div className="text-center">
                                    <h1 className="text-3xl font-bold font-orbitron mb-4">
                                        Bem-vindo(a), {profileData.nome}!
                                    </h1>
                                    <p className="text-texto-claro/80">
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
                                    <div className="flex justify-center">
                                        <AppCard className="bg-black/20 p-4 rounded-lg w-fill">
                                            <p><strong>Nome:</strong> {profileData.nome}</p>
                                            <p><strong>Email:</strong> {profileData.email}</p>
                                            <p><strong>Telefone:</strong> {profileData.telefone}</p>
                                            <p><strong>CPF:</strong> {profileData.cpf}</p>
                                            <p><strong>Sexo:</strong> {profileData.sexo}</p>
                                            <div className="p-4 flex justify-center">
                                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline"><i className="fas fa-user-edit"></i> Editar Meus Dados</Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-[425px]">
                                                        {formStatus === 'success' ? (
                                                            <div className="flex flex-col items-center justify-center p-8 h-48">
                                                                <i className="fas fa-check-circle text-verde-claro text-5xl mb-4"></i>
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
                                    <div className="text-center mt-4">
                                        <button
                                            onClick={handleLogout}
                                            className="text-azul-claro/80 hover:text-azul-claro hover:underline transition-colors">
                                            <i className="fas fa-sign-out-alt"></i> Sair da Conta
                                        </button>
                                    </div>
                                </div>
                            )}
                            {activeTab === '#AbaRelatorio' && (
                                <div>
                                    <h2 className="text-2xl font-orbitron text-verde-claro mb-4">Meus Relatório</h2>
                                    <p>Conteúdo do relatório de veículos aqui...</p>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}