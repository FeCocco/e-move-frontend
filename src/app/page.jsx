"use client";
import { useState } from "react";
import LoginStepper from "/src/components/LoginStepper/LoginStepper";
import Logo from "/src/components/logo";
import styles from "./page.module.css";

export default function Home() {
    const [showStepper, setShowStepper] = useState(false);
    return (

        <div>
            <Logo />
            {!showStepper ? (
                // Tela inicial de apresentação
                <div className="container-tela-inicial">
                    <h1 className="text-4xl font-bold mb-4">Bem-vindo ao e-Move 🚗⚡</h1>
                    <p className="mb-6 text-lg text-gray-600">
                        Planejamento Inteligente para a sua Jornada Elétrica
                    </p>
                    <button
                        onClick={() => setShowStepper(true)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                    >
                        Entrar
                    </button>
                </div>
            ) : (
                // Stepper de login
                <LoginStepper />
            )}
        </div>
    );
}
