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
import { CardDescription, CardTitle } from "@/components/ui/card";
import { AppCard, AppCardHeader, AppCardContent } from "@/components/AppCard/AppCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from '@/components/DatePicker/DatePicker';
import { getApiErrorMessage } from '@/lib/errorHandler';
import GenderSelector from "@/components/ui/GenderSlector";
import MedidorForcaSenha from "@/components/ui/MedidorForcaSenha";
import { formatarTelefone } from "@/lib/utils";

// ============================================================================
// SCHEMA DE VALIDAÇÃO (ZOD)
// ============================================================================
const cadastroSchema = z.object({
    nome: z.string().min(3, { message: "O nome deve ter no mínimo 3 caracteres." }),
    email: z.email({ message: "Formato de e-mail inválido." }),
    telefone: z.string()
        .min(14, { message: "O telefone parece incompleto." })
        .max(15, { message: "Telefone inválido." }),
    sexo: z.string().nonempty("Por favor, selecione um gênero."),
    dataNascimento: z
        .date()
        .nullable()
        .refine((date) => date !== null && !isNaN(date.getTime()), {
            message: "Por favor, selecione uma data."
        }),
    senha: z.string().min(8, { message: "A senha deve ter no mínimo 8 caracteres." }),
    senha_confirmacao: z.string()
}).refine(data => data.senha === data.senha_confirmacao, {
    message: "As senhas não coincidem.",
    path: ["senha_confirmacao"],
});

// ============================================================================
// COMPONENTE DA PÁGINA DE CADASTRO
// ============================================================================
export default function CadastroPage() {
    const API_URL = 'http://localhost:8080/api';
    const router = useRouter();
    const [apiError, setApiError] = useState('');
    const [success, setSuccess] = useState('');

    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
        resolver: zodResolver(cadastroSchema),
        mode: "onBlur",
        defaultValues: {
            nome: "",
            email: "",
            telefone: "",
            sexo: "",
            dataNascimento: null,
            senha: "",
            senha_confirmacao: "",
        }
    });

    const senhaValue = watch('senha');
    const sexoValue = watch('sexo');

    const handleCadastroSubmit = async (data) => {
        setApiError('');
        setSuccess('');

        const dadosParaEnviar = {
            ...data,
            telefone: data.telefone.replace(/\D/g, '')
        };

        try {
            const response = await fetch(`${API_URL}/cadastro`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosParaEnviar),
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
            setApiError(getApiErrorMessage(err.message));
        }
    };

    return (
        <div className="flex items-center justify-center w-full min-h-screen py-8 px-4">
            <AppCard className="w-full max-w-lg">
                <AppCardHeader>
                    {apiError && <p className="text-red-400 bg-red-900/20 border border-red-400 p-3 mb-4 rounded-lg text-center">{apiError}</p>}
                    {success && <p className="text-green-400 bg-green-900/20 border border-green-400 p-3 mb-4 rounded-lg text-center">{success}</p>}

                    <div className="text-center">
                        <CardTitle className="text-2xl font-bold">Criar Conta</CardTitle>
                        <CardDescription className="text-texto-claro/80 pt-2">
                            Já é um membro?{' '}
                            <Link href="/login" className="p-0 h-auto text-azul-claro hover:underline">
                                Login
                            </Link>
                        </CardDescription>
                    </div>
                </AppCardHeader>

                <AppCardContent>
                    <form onSubmit={handleSubmit(handleCadastroSubmit)} className="flex flex-col gap-2 text-left">

                        <Label htmlFor="nome">Nome Completo</Label>
                        <Input id="nome" {...register("nome")} placeholder="Seu nome completo" className="bg-white/5 border-white/30 placeholder:text-white/50 focus-visible:ring-azul-claro h-11" />
                        {errors.nome && <p className="text-vermelho-status text-xs mt-1">{errors.nome.message}</p>}

                        <Label htmlFor="email" className="mt-3">Email</Label>
                        <Input id="email" {...register("email")} placeholder="seu@email.com" className="bg-white/5 border-white/30 placeholder:text-white/50 focus-visible:ring-azul-claro h-11" />
                        {errors.email && <p className="text-vermelho-status text-xs mt-1">{errors.email.message}</p>}

                        <Label htmlFor="telefone" className="mt-3">Telefone</Label>
                        <Input
                            id="telefone"
                            type="tel"
                            placeholder="(xx) xxxxx-xxxx"
                            className="bg-white/5 border-white/30 placeholder:text-white/50 focus-visible:ring-azul-claro h-11"
                            {...register("telefone")}
                            onChange={(e) => {

                                const formatted = formatarTelefone(e.target.value);

                                e.target.value = formatted;

                                register("telefone").onChange(e);
                            }}
                            maxLength={15}
                        />
                        {errors.telefone && <p className="text-vermelho-status text-xs mt-1">{errors.telefone.message}</p>}

                        <Label htmlFor="sexo" className="mt-3">Sexo</Label>
                        <GenderSelector
                            value={sexoValue}
                            onChange={(value) => setValue("sexo", value, { shouldValidate: true })}
                        />
                        {errors.sexo && <p className="text-vermelho-status text-xs mt-1">{errors.sexo.message}</p>}

                        <Label htmlFor="dataNascimento" className="mt-3">Data de Nascimento</Label>
                        <DatePicker onDateChange={(date) => setValue("dataNascimento", date, { shouldValidate: true })} />
                        {errors.dataNascimento && <p className="text-vermelho-status text-xs mt-1">{errors.dataNascimento.message}</p>}

                        <Label htmlFor="senha" className="mt-3">Senha</Label>
                        <Input id="senha" type="password" {...register("senha")} placeholder="Crie uma senha" className="bg-white/5 border-white/30 placeholder:text-white/50 focus-visible:ring-azul-claro h-11" />
                        <MedidorForcaSenha password={senhaValue || ''} />
                        {errors.senha && <p className="text-vermelho-status text-xs mt-1">{errors.senha.message}</p>}

                        <Label htmlFor="senha_confirmacao" className="mt-3">Confirme sua Senha</Label>
                        <Input id="senha_confirmacao" type="password" {...register("senha_confirmacao")} placeholder="Confirme sua senha" className="bg-white/5 border-white/30 placeholder:text-white/50 focus-visible:ring-azul-claro h-11" />
                        {errors.senha_confirmacao && <p className="text-vermelho-status text-xs mt-1">{errors.senha_confirmacao.message}</p>}

                        <button type="submit" className="text-white uppercase bg-azul-botao cursor-pointer rounded-xl py-3 px-6 text-base font-bold transition-all duration-300 ease-in-out mt-4">
                            Cadastrar
                        </button>
                    </form>
                </AppCardContent>
            </AppCard>
        </div>
    );
}