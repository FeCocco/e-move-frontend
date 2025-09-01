'use client';
import { useState } from 'react';
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { CardHeader, CardDescription, CardContent, CardTitle } from "@/components/ui/card";
import AppCard from "@/components/AppCard/AppCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from '@/components/DatePicker/DatePicker';
import MedidorForcaSenha from "@/components/ui/MedidorForcaSenha";


export default function CadastroPage() {
    const API_URL = 'http://localhost:8080/api';
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '', senha: '', nome: '', telefone: '', cpf: '', dataNascimento: null, senha_confirmacao: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (date) => {
        setFormData(prev => ({ ...prev, dataNascimento: date }));
    };

    const handleCadastroSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.senha !== formData.senha_confirmacao) {
            setError("As senhas não coincidem.");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/cadastro`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nome: formData.nome, email: formData.email, telefone: formData.telefone,
                    cpf: formData.cpf, dataNascimento: formData.dataNascimento, senha: formData.senha
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Falha ao cadastrar.');
            }

            setSuccess('Cadastro realizado com sucesso! Redirecionando para o login...');
            setTimeout(() => {
                router.push('/login');
            }, 2000); // aguarda 2 segundos para o usuário ver a mensagem

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <AppCard>
            {error && <p className="text-red-400 bg-red-900/20 border border-red-400 p-3 m-6 rounded-lg text-center">{error}</p>}
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
                <form onSubmit={handleCadastroSubmit} className="flex flex-col gap-2 text-left">
                    <Label htmlFor="nome">Nome Completo</Label>
                    <Input id="nome" name="nome" type="text" placeholder="Seu nome completo" required onChange={handleInputChange} className="bg-white/5 border-white/30 placeholder:text-white/50 focus-visible:ring-azul-claro h-12" />

                    <Label htmlFor="email_cadastro" className="mt-4">Email</Label>
                    <Input id="email_cadastro" name="email" type="email" placeholder="seu@email.com" required onChange={handleInputChange} className="bg-white/5 border-white/30 placeholder:text-white/50 focus-visible:ring-azul-claro h-12" />

                    <Label htmlFor="cpf" className="mt-4">CPF</Label>
                    <Input id="cpf" name="cpf" type="text" placeholder="000.000.000-00" required onChange={handleInputChange} className="bg-white/5 border-white/30 placeholder:text-white/50 focus-visible:ring-azul-claro h-12" />

                    <Label htmlFor="telefone_cadastro" className="mt-4">Telefone</Label>
                    <Input id="telefone_cadastro" name="telefone" type="phone" placeholder="(xx) xxxxx-xxxx" required onChange={handleInputChange} className="bg-white/5 border-white/30 placeholder:text-white/50 focus-visible:ring-azul-claro h-12" />

                    <Label htmlFor="dataNascimento" className="mt-4">Data de Nascimento</Label>
                    <DatePicker onDateChange={handleDateChange} />

                    <Label htmlFor="senha_cadastro" className="mt-4">Senha</Label>
                    <Input id="senha_cadastro" name="senha" type="password" placeholder="Crie uma senha" required onChange={handleInputChange} className="bg-white/5 border-white/30 placeholder:text-white/50 focus-visible:ring-azul-claro h-12" />
                    <MedidorForcaSenha password={formData.senha || ''} />

                    <Label htmlFor="senha_confirmacao" className="mt-4">Confirme sua Senha</Label>
                    <Input id="senha_confirmacao" name="senha_confirmacao" type="password" placeholder="Confirme sua senha" required onChange={handleInputChange} className="bg-white/5 border-white/30 placeholder:text-white/50 focus-visible:ring-azul-claro h-12" />
                    <button type="submit" className="text-white uppercase bg-azul-botao cursor-pointer rounded-xl py-3 px-6 text-base font-bold transition-all duration-300 ease-in-out mt-6 hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(0,255,255,0.4)]">
                        Cadastrar
                    </button>
                </form>
            </CardContent>
        </AppCard>
    );
}