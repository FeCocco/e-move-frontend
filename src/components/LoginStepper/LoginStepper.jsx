'use client';
import { useState } from 'react';
import { useRouter} from "next/navigation";
import {CardHeader, CardDescription, CardContent, CardTitle} from "@/components/ui/card";
import AppCard from "@/components/AppCard/AppCard";
import Logo from "@/components/Logo/Logo";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {AnimatePresence, motion} from "framer-motion";

export default function LoginStepper() {
    const API_URL = 'http://localhost:8080/api';
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ email: '', senha: '', nome: ''});
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const RedirecionarParaPainel = () => {
        router.push('/dashboard');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const animationVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, senha: formData.senha }),
            });
            if (!response.ok) throw new Error(await response.text() || 'E-mail ou senha inválidos.');

            const loggedUser = await response.json();
            if (!loggedUser.cpf || !loggedUser.telefone) {
                setNewUserId(loggedUser.id);
                setFormData(loggedUser);
                setStep(4);
            } else {
                setSuccess(`Bem-vindo(a) de volta, ${loggedUser.nome}!`);
                RedirecionarParaPainel();
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <AppCard>
            {error && <p className="text-red-400 bg-red-900/20 border border-red-400 p-3 m-6 rounded-lg text-center">{error}</p>}
            {success && <p className="text-green-400 bg-green-900/20 border border-green-400 p-3 m-6 rounded-lg text-center">{success}</p>}
            <AnimatePresence mode="wait">
            {step === 1 && (
                <motion.div
                    key="login"
                    variants={animationVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                >
                    <CardHeader>
                        <Logo className="text-[3.5vmin] font-bold tracking-widest mb-5 text-azul-claro drop-shadow-[0_0_8px_rgba(0,255,255,0.4)] text-center"/>
                        <CardDescription className="text-texto-claro/80 text-center pt-2">Insira suas informações de Login</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center flex-col flex">
                        <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4 text-left">
                            <Label htmlFor="email">Email: </Label>
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="seu@email.com"
                                required
                                className="w-full p-3 rounded-lg border border-white/30 bg-white/5 text-white placeholder:text-white/50 focus:outline-none focus:border-azul-claro focus:ring-2 focus:ring-azul-claro/50"
                            />
                            <div className="flex items-center">
                                <Label htmlFor="password">Senha:</Label>
                                <Button
                                    variant="link"
                                    className="ml-auto inline-block text-azul-claro underline hover:text-azul-botao"
                                >
                                    Esqueci minha senha
                                </Button>
                            </div>
                            <input
                                name="senha"
                                type="password"
                                value={formData.senha}
                                onChange={handleInputChange}
                                placeholder="Sua Senha"
                                required
                                className="w-full p-3 rounded-lg border border-white/30 bg-white/5 text-white placeholder:text-white/50 focus:outline-none focus:border-azul-claro focus:ring-2 focus:ring-azul-claro/50"
                            />
                            <button
                                type="submit"
                                className="text-white uppercase bg-azul-botao cursor-pointer rounded-xl py-3 px-6 text-base font-bold transition-all duration-300 ease-in-out mt-3 hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(0,255,255,0.4)]"
                            >
                                Entrar
                            </button>
                        </form>
                        <Button variant="link" onClick={() => setStep(2)} className="mt-3 text-azul-claro underline hover:text-azul-botao">Criar nova conta</Button>
                        <button
                            type="button" //PARA NAO PEDIR CONFIRMACAO DO FORMULARIO
                            onClick={RedirecionarParaPainel}
                            className="text-white uppercase bg-red-600 cursor-pointer rounded-xl py-3 px-6 text-base font-bold transition-all duration-300 ease-in-out mt-3 hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(0,255,255,0.4)]">
                            Acesso ao painel (DEV)
                        </button>

                    </CardContent>
                </motion.div>
            )}
            {step === 2 && (
                <motion.div
                    key="register"
                    variants={animationVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                >
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold">Criar Conta</CardTitle>
                        <CardDescription className="text-texto-claro/80 pt-2">
                            Já é um membro?{' '}
                            <Button variant="link" onClick={() => setStep(1)} className="p-0 h-auto text-azul-claro hover:underline">
                                Login
                            </Button>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="flex flex-col gap-2 text-left">
                            <Label htmlFor="nome">Nome Completo</Label>
                            <Input id="nome" name="nome" type="text" placeholder="Seu nome completo" required onChange={handleInputChange} className="bg-white/5 border-white/30 placeholder:text-white/50 focus-visible:ring-azul-claro"/>

                            <Label htmlFor="email_cadastro" className="mt-4">Email</Label>
                            <Input id="email_cadastro" name="email" type="email" placeholder="seu@email.com" required onChange={handleInputChange} className="bg-white/5 border-white/30 placeholder:text-white/50 focus-visible:ring-azul-claro"/>

                            <Label htmlFor="telefone_cadastro" className="mt-4">Telefone</Label>
                            <Input id="telefone_cadastro" name="telefone" type="phone" placeholder="(xx) xxxxx-xxxx" required onChange={handleInputChange} className="bg-white/5 border-white/30 placeholder:text-white/50 focus-visible:ring-azul-claro"/>

                            <Label htmlFor="senha_cadastro" className="mt-4">Senha</Label>
                            <Input id="senha_cadastro" name="senha" type="password" placeholder="Crie uma senha" required onChange={handleInputChange} className="bg-white/5 border-white/30 placeholder:text-white/50 focus-visible:ring-azul-claro"/>

                            <Label htmlFor="senha_confirmacao" className="mt-4">Confirme sua Senha</Label>
                            <Input id="senha_confirmacao" name="senha" type="password" placeholder="Confirme sua senha" required onChange={handleInputChange} className="bg-white/5 border-white/30 placeholder:text-white/50 focus-visible:ring-azul-claro"/>

                            <button
                                type="submit"
                                className="text-white uppercase bg-azul-botao cursor-pointer rounded-xl py-3 px-6 text-base font-bold transition-all duration-300 ease-in-out mt-6 hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(0,255,255,0.4)]"
                            >
                                Cadastrar
                            </button>
                        </form>
                    </CardContent>
                </motion.div>
            )}
            </AnimatePresence>
        </AppCard>
    );
}