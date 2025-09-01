'use client';
import { useState } from 'react';
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { CardHeader, CardDescription, CardContent } from "@/components/ui/card";
import AppCard from "@/components/AppCard/AppCard";
import Logo from "@/components/Logo/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
    const API_URL = 'http://localhost:8080/api';
    const router = useRouter();
    const [formData, setFormData] = useState({ email: '', senha: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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

            const data = await response.json();
            localStorage.setItem('e-move-token', data.token);
            setSuccess('Login bem-sucedido! Redirecionando...');
            router.push('/dashboard');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <AppCard>
            {error && <p className="text-red-400 bg-red-900/20 border border-red-400 p-3 m-6 rounded-lg text-center">{error}</p>}
            {success && <p className="text-green-400 bg-green-900/20 border border-green-400 p-3 m-6 rounded-lg text-center">{success}</p>}

            <CardHeader>
                <Logo className="text-[3.5vmin] font-bold tracking-widest mb-5 text-azul-claro drop-shadow-[0_0_8px_rgba(0,255,255,0.4)] text-center" />
                <CardDescription className="text-texto-claro/80 text-center pt-2">Insira suas informações de Login</CardDescription>
            </CardHeader>
            <CardContent className="text-center flex-col flex">
                <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4 text-left">
                    <Label htmlFor="email">Email: </Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="seu@email.com" required className="bg-white/5 border-white/30 placeholder:text-white/50 focus-visible:ring-azul-claro h-12" />

                    <div className="flex items-center">
                        <Label htmlFor="senha">Senha:</Label>
                        <Button type="button" variant="link" className="ml-auto inline-block text-azul-claro underline hover:text-azul-botao">
                            Esqueci minha senha
                        </Button>
                    </div>
                    <Input id="senha" name="senha" type="password" value={formData.senha} onChange={handleInputChange} placeholder="Sua Senha" required className="bg-white/5 border-white/30 placeholder:text-white/50 focus-visible:ring-azul-claro h-12" />

                    <button type="submit" className="text-white uppercase bg-azul-botao cursor-pointer rounded-xl py-3 px-6 text-base font-bold transition-all duration-300 ease-in-out mt-3 hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(0,255,255,0.4)]">
                        Entrar
                    </button>
                </form>
                <Link href="/cadastro" className="mt-3 text-azul-claro underline hover:text-azul-botao">
                    Criar nova conta
                </Link>
            </CardContent>
        </AppCard>
    );
}