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

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState('#BemVindo');
    const router = useRouter();
    // O 'profileData' agora será a nossa única fonte da verdade sobre o usuário.
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/usuario/me', {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Sessão inválida ou expirada.');
                }

                const data = await response.json();
                setProfileData(data); // Salva os dados do usuario se a chamada for bem-sucedida

            } catch (error) {
                console.error(error);
                // Se qualquer erro ocorrer (falha de rede, token inválido), redireciona para o login.
                router.push('/');
            }
        };

        fetchProfile();

    }, [router]);

    // Exibe "Carregando..." enquanto esperamos a resposta do fetchProfile.
    // Se o fetch falhar, o usuário será redirecionado antes de ver a página.
    if (!profileData) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-white text-2xl">Verificando sessão...</p>
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
                                <div className="bg-black/20 p-4 rounded-lg">
                                    <p><strong>Nome:</strong> {profileData.nome}</p>
                                    <p><strong>Email:</strong> {profileData.email}</p>
                                    <p><strong>Telefone:</strong> {profileData.telefone}</p>
                                    <p><strong>CPF:</strong> {profileData.cpf}</p>
                                    <p><strong>Sexo:</strong> {profileData.sexo}</p>
                                    <div className="p-4 flex justify-center">
                                        <Dialog>
                                            <form>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline"><i className="fas fa-user-edit"></i>Editar Meus Dados</Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[425px]">
                                                    <DialogHeader>
                                                        <DialogTitle>Editar Perfil</DialogTitle>
                                                        <DialogDescription>
                                                            Faça suas modificações aqui e salve quando tiver finalizado.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="grid gap-4">
                                                        <div className="grid gap-3">
                                                            <Label htmlFor="edit_nome">Nome</Label>
                                                            <Input id="edit_nome" name="nome" defaultValue={profileData.nome} />
                                                        </div>
                                                        <div className="grid gap-3">
                                                            <Label htmlFor="edit_email">e-mail</Label>
                                                            <Input id="edit_email" name="e-mail" defaultValue={profileData.email} />
                                                        </div>
                                                        <div className="grid gap-3">
                                                            <Label htmlFor="edit_telefone">Telefone</Label>
                                                            <Input id="edit_telefone" name="telefone" defaultValue={profileData.telefone} />
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <DialogClose asChild>
                                                            <Button variant="outline">Cancelar</Button>
                                                        </DialogClose>
                                                        <Button type="submit" className="underline hover: hover:text-verde-claro">Salvar</Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </form>
                                        </Dialog>
                                    </div>
                                </div>

                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}