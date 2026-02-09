'use client';

import { useState } from 'react';
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { CardDescription } from "@/components/ui/card";
import { AppCard, AppCardHeader, AppCardContent } from "@/components/AppCard/AppCard";
import Logo from "@/components/Logo/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from '@/lib/api';

const loginSchema = z.object({
    email: z.email({ message: "Formato de e-mail inválido." }),
    senha: z.string().min(1, { message: "A senha não pode estar em branco." }),
});

export default function LoginPage() {
    const router = useRouter();
    const [apiError, setApiError] = useState('');
    const [success, setSuccess] = useState('');

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(loginSchema),
        mode: "onBlur",
    });

    const handleLoginSubmit = async (data) => {
        setApiError('');
        setSuccess('');

        try {
            await api.post('/login', data);

            setSuccess('Login bem-sucedido! Redirecionando...');
            router.push('/dashboard');

        } catch (err) {
            const mensagemErro = err.response?.data || err.message || 'Erro ao realizar login.';
            setApiError(mensagemErro);
        }
    };

    return (
        <div className="flex items-center justify-center w-full min-h-screen px-4">
            <AppCard className="w-full max-w-md">
                <AppCardHeader>
                    {apiError && <p className="text-red-400 bg-red-900/20 border border-red-400 p-3 mb-4 rounded-lg text-center">{apiError}</p>}
                    {success && <p className="text-green-400 bg-green-900/20 border border-green-400 p-3 mb-4 rounded-lg text-center">{success}</p>}

                    <Logo className="text-[3.5vmin] font-bold tracking-widest text-azul-claro drop-shadow-[0_0_8px_rgba(0,255,255,0.4)] text-center" />
                    <CardDescription className="text-texto-claro/80 text-center pt-2">Insira suas informações de Login</CardDescription>
                </AppCardHeader>

                <AppCardContent>
                    <form onSubmit={handleSubmit(handleLoginSubmit)} className="flex flex-col gap-4 text-left">
                        <Label htmlFor="email">Email: </Label>
                        <Input id="email" {...register("email")} placeholder="seu@email.com" className="bg-white/5 border-white/30 placeholder:text-white/50 focus-visible:ring-azul-claro h-11" />
                        {errors.email && <p className="text-vermelho-status text-xs -mt-2">{errors.email.message}</p>}

                        <div className="flex items-center">
                            <Label htmlFor="senha">Senha:</Label>
                            <Button type="button" variant="link" className="ml-auto inline-block text-azul-claro underline hover:text-azul-botao">
                                Esqueci minha senha
                            </Button>
                        </div>
                        <Input id="senha" type="password" {...register("senha")} placeholder="Sua Senha" className="bg-white/5 border-white/30 placeholder:text-white/50 focus-visible:ring-azul-claro h-11" />
                        {errors.senha && <p className="text-vermelho-status text-xs -mt-2">{errors.senha.message}</p>}

                        <button type="submit" className="text-white uppercase bg-azul-botao cursor-pointer rounded-xl py-3 px-6 text-base font-bold transition-all duration-300 ease-in-out mt-3 hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(0,255,255,0.4)]">
                            Entrar
                        </button>
                    </form>

                    <div className="text-center mt-3">
                        <Link href="/cadastro" className="text-azul-claro underline hover:text-azul-botao">
                            Criar nova conta
                        </Link>
                    </div>
                </AppCardContent>
            </AppCard>
        </div>
    );
}