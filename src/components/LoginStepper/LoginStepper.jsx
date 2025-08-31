'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = 'http://localhost:8080/api';

export default function LoginStepper() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [newUserId, setNewUserId] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        email: '', nome: '', telefone: '', cpf: '', dataNascimento: '', senha: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="grid place-items-center min-h-screen py-10">
            <div className="bg-white/10 p-10 rounded-2xl shadow-lg w-full max-w-md backdrop-blur-sm">

                {/* Você pode recriar o componente Stepper com divs e classes do Tailwind se desejar */}

                {error && <p className="text-red-400 bg-white/10 border border-red-400 p-3 rounded-lg text-center mb-5">{error}</p>}
                {success && <p className="text-green-400 bg-white/10 border border-green-400 p-3 rounded-lg text-center mb-5">{success}</p>}

                {step === 1 && (
                    <form onSubmit={()=>{}} className="flex flex-col gap-4">
                        <h2 className="text-texto-claro text-center text-2xl font-bold mb-1">Acesse sua conta</h2>
                        <p className="text-texto-claro/80 text-center mb-4">Informe seu e-mail para continuar.</p>
                        <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="seu@email.com"
                            required
                            className="w-full p-3 rounded-lg border border-white/30 bg-white/5 text-white placeholder:text-white/50 focus:outline-none focus:border-azul-claro focus:ring-2 focus:ring-azul-claro/50"
                        />
                        <button
                            type="submit"
                            className="text-black bg-azul-claro cursor-pointer rounded-full py-3 px-6 text-base font-bold transition-all duration-300 ease-in-out mt-3 hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(0,255,255,0.4)]"
                        >
                            Continuar
                        </button>
                    </form>
                )}

            </div>
        </div>
    );
}