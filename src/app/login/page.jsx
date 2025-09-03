'use client';

// ============================================================================
// IMPORTS
// ============================================================================
import { useState } from 'react';
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Componentes da Interface (UI)
import { CardHeader, CardDescription, CardContent } from "@/components/ui/card";
import { AppCard, AppCardHeader, AppCardContent } from "@/components/AppCard/AppCard";
import Logo from "@/components/Logo/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ============================================================================
// SCHEMA DE VALIDAÇÃO (ZOD)
// ============================================================================
// Schema de validação para o formulário de login.
const loginSchema = z.object({
    email: z.string().email({ message: "Formato de e-mail inválido." }),
    senha: z.string().min(1, { message: "A senha não pode estar em branco." }), // Apenas verificamos se não está vazia
});

// ============================================================================
// COMPONENTE DA PÁGINA DE LOGIN
// ============================================================================
export default function LoginPage() {
    // --- Hooks e State Management ---
    const API_URL = 'http://localhost:8080/api';
    const router = useRouter();

    // Estados para feedback da API (erros ou sucesso após o envio)
    const [apiError, setApiError] = useState('');
    const [success, setSuccess] = useState('');

    // Configuração do React Hook Form, conectando-o com o schema do Zod
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(loginSchema)
    });

    // --- Funções de Manipulação de Eventos ---

    // Função de envio do formulário, executada apenas após a validação do Zod
    const handleLoginSubmit = async (data) => {
        setApiError('');
        setSuccess('');

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'E-mail ou senha inválidos.');
            }

            const responseData = await response.json();
            localStorage.setItem('e-move-token', responseData.token);
            setSuccess('Login bem-sucedido! Redirecionando...');
            router.push('/dashboard');

        } catch (err) {
            setApiError(getApiErrorMessage(err));
        }
    };

    // --- Renderização do Componente (JSX) ---
    return (
        <AppCard>
            <AppCardHeader>
                {apiError && <p className="text-red-400 bg-red-900/20 border border-red-400 p-3 mb-4 rounded-lg text-center">{apiError}</p>}
                {success && <p className="text-green-400 bg-green-900/20 border border-green-400 p-3 mb-4 rounded-lg text-center">{success}</p>}

                <Logo className="text-[3.5vmin] font-bold tracking-widest text-azul-claro drop-shadow-[0_0_8px_rgba(0,255,255,0.4)] text-center" />
                <CardDescription className="text-texto-claro/80 text-center pt-2">Insira suas informações de Login</CardDescription>
            </AppCardHeader>

            <AppCardContent>
                <form onSubmit={handleSubmit(handleLoginSubmit)} className="flex flex-col gap-4 text-left">

                    {/* Campo Email */}
                    <Label htmlFor="email">Email: </Label>
                    <Input id="email" {...register("email")} placeholder="seu@email.com" className="bg-white/5 border-white/30 placeholder:text-white/50 focus-visible:ring-azul-claro h-12" />
                    {errors.email && <p className="text-vermelho-status text-xs -mt-2">{errors.email.message}</p>}

                    {/* Campo Senha */}
                    <div className="flex items-center">
                        <Label htmlFor="senha">Senha:</Label>
                        <Button type="button" variant="link" className="ml-auto inline-block text-azul-claro underline hover:text-azul-botao">
                            Esqueci minha senha
                        </Button>
                    </div>
                    <Input id="senha" type="password" {...register("senha")} placeholder="Sua Senha" className="bg-white/5 border-white/30 placeholder:text-white/50 focus-visible:ring-azul-claro h-12" />
                    {errors.senha && <p className="text-vermelho-status text-xs -mt-2">{errors.senha.message}</p>}

                    {/* Botão de Envio */}
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
    );
}