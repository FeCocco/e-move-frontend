//Teste de autenticação SSH
'use client';
import { useState } from 'react';
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { CardHeader, CardDescription, CardContent, CardTitle } from "@/components/ui/card";
import AppCard from "@/components/AppCard/AppCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from '@/components/DatePicker/DatePicker';
import MedidorForcaSenha from "@/components/ui/MedidorForcaSenha";

const cadastroSchema = z.object({
    nome: z.string().min(3, { message: "O nome deve ter no mínimo 3 caracteres." }),
    email: z.string().email({ message: "Formato de e-mail inválido." }),
    cpf: z.string().min(11, { message: "O CPF deve ter no mínimo 11 dígitos." }),
    telefone: z.string().min(10, { message: "O telefone deve ter no mínimo 10 dígitos." }),
    dataNascimento: z.date({ required_error: "Por favor, selecione uma data." }),
    senha: z.string().min(8, { message: "A senha deve ter no mínimo 8 caracteres." }),
    senha_confirmacao: z.string()
}).refine(data => data.senha === data.senha_confirmacao, {
    message: "As senhas não coincidem.",
    path: ["senha_confirmacao"],
});

export default function CadastroPage() {
    const API_URL = 'http://localhost:8080/api';
    const router = useRouter();
    const [apiError, setApiError] = useState('');
    const [success, setSuccess] = useState('');

    const { register, handleSubmit, formState: { errors }, setValue, watch, control } = useForm({
        resolver: zodResolver(cadastroSchema)
    });

    const senhaValue = watch('senha');

    const handleCadastroSubmit = async (data) => {
        setApiError('');
        setSuccess('');

        try {
            const response = await fetch(`${API_URL}/cadastro`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Falha ao cadastrar.');
            }

            setSuccess('Cadastro realizado com sucesso! Redirecionando para o login...');
            setTimeout(() => {
                router.push('/login');
            }, 2000);

        } catch (err) {
            setApiError(err.message);
        }
    };

    return (
        <AppCard>
            {apiError && <p className="text-red-400 bg-red-900/20 border border-red-400 p-3 m-6 rounded-lg text-center">{apiError}</p>}
            {success && <p className="text-green-400 bg-green-900/20 border border-green-400 p-3 m-6 rounded-lg text-center">{success}</p>}

            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Criar Conta</CardTitle>
                <CardDescription className="text-texto-claro/80 pt-2">
                    Já é um membro?{' '}
                    <Link href="/login" className="p-0 h-auto text-azul-claro hover:underline">
                        Login
                    </Link>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(handleCadastroSubmit)} className="flex flex-col gap-2 text-left">
                    <Label htmlFor="nome">Nome Completo</Label>
                    <Input id="nome" {...register("nome")} placeholder="Seu nome completo" className="bg-white/5 border-white/30 placeholder:text-white/50 focus-visible:ring-azul-claro h-12" />
                    {errors.nome && <p className="text-vermelho-status text-xs mt-1">{errors.nome.message}</p>}

                    <Label htmlFor="email_cadastro" className="mt-4">Email</Label>
                    <Input id="email_cadastro" {...register("email")} placeholder="seu@email.com" className="bg-white/5 border-white/30 placeholder:text-white/50 focus-visible:ring-azul-claro h-12" />
                    {errors.email && <p className="text-vermelho-status text-xs mt-1">{errors.email.message}</p>}

                    <Label htmlFor="cpf" className="mt-4">CPF</Label>
                    <Input id="cpf" {...register("cpf")} placeholder="000.000.000-00" className="bg-white/5 border-white/30 placeholder:text-white/50 focus-visible:ring-azul-claro h-12" />
                    {errors.cpf && <p className="text-vermelho-status text-xs mt-1">{errors.cpf.message}</p>}

                    <Label htmlFor="telefone_cadastro" className="mt-4">Telefone</Label>
                    <Input id="telefone_cadastro" {...register("telefone")} type="phone" placeholder="(xx) xxxxx-xxxx" className="bg-white/5 border-white/30 placeholder:text-white/50 focus-visible:ring-azul-claro h-12" />
                    {errors.telefone && <p className="text-vermelho-status text-xs mt-1">{errors.telefone.message}</p>}

                    <Label htmlFor="dataNascimento" className="mt-4">Data de Nascimento</Label>
                    <DatePicker onDateChange={(date) => setValue("dataNascimento", date, { shouldValidate: true })} />
                    {errors.dataNascimento && <p className="text-vermelho-status text-xs mt-1">{errors.dataNascimento.message}</p>}

                    <Label htmlFor="senha_cadastro" className="mt-4">Senha</Label>
                    <Input id="senha_cadastro" type="password" {...register("senha")} placeholder="Crie uma senha" className="bg-white/5 border-white/30 placeholder:text-white/50 focus-visible:ring-azul-claro h-12" />
                    <MedidorForcaSenha password={senhaValue || ''} />
                    {errors.senha && <p className="text-vermelho-status text-xs mt-1">{errors.senha.message}</p>}

                    <Label htmlFor="senha_confirmacao" className="mt-4">Confirme sua Senha</Label>
                    <Input id="senha_confirmacao" type="password" {...register("senha_confirmacao")} placeholder="Confirme sua senha" className="bg-white/5 border-white/30 placeholder:text-white/50 focus-visible:ring-azul-claro h-12" />
                    {errors.senha_confirmacao && <p className="text-vermelho-status text-xs mt-1">{errors.senha_confirmacao.message}</p>}

                    <button type="submit" className="text-white uppercase bg-azul-botao cursor-pointer rounded-xl py-3 px-6 text-base font-bold transition-all duration-300 ease-in-out mt-6 hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(0,255,255,0.4)]">
                        Cadastrar
                    </button>
                </form>
            </CardContent>
        </AppCard>
    );
}