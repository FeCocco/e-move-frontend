'use client';
import { useState } from 'react';
import { Card, CardHeader, CardDescription, CardContent } from "@/components/ui/card";
import Logo from "@/components/Logo/Logo";
import {Button} from "@/components/ui/button";

export default function LoginStepper() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ email: '', senha: ''});
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <Card className="w-full max-w-md bg-transparent border-white/20 shadow-lg backdrop-blur-sm">
            {error && <p className="text-red-400 bg-red-900/20 border border-red-400 p-3 m-6 rounded-lg text-center">{error}</p>}
            {success && <p className="text-green-400 bg-green-900/20 border border-green-400 p-3 m-6 rounded-lg text-center">{success}</p>}

            {step === 1 && (
                <>
                    <CardHeader>
                        <Logo className="text-[3.5vmin] font-bold tracking-widest mb-5 text-azul-claro drop-shadow-[0_0_8px_rgba(0,255,255,0.4)] text-center"/>
                        <CardDescription className="text-texto-claro/80 text-center pt-2">Insira suas informações de Login</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center flex-col flex">
                        <form onSubmit={() => {}} className="flex flex-col gap-4 text-left">
                            <label htmlFor="email">Email: </label>
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="seu@email.com"
                                required
                                className="w-full p-3 rounded-lg border border-white/30 bg-white/5 text-white placeholder:text-white/50 focus:outline-none focus:border-azul-claro focus:ring-2 focus:ring-azul-claro/50"
                            />
                            <label htmlFor="senha">Senha:</label>
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
                        <Button variant="link" className="mt-3 text-azul-claro underline hover:text-azul-botao">Esqueci minha senha</Button>
                        <Button variant="link" className="mt-3 text-azul-claro underline hover:text-azul-botao">Criar nova conta</Button>
                        <button
                            type=""
                            className="text-white uppercase bg-red-600 cursor-pointer rounded-xl py-3 px-6 text-base font-bold transition-all duration-300 ease-in-out mt-3 hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(0,255,255,0.4)]"
                        >
                            Acesso ao painel (DEV)
                        </button>

                    </CardContent>
                </>
            )}
        </Card>
    );
}