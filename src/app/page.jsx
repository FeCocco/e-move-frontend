"use client";
import { useState } from "react";
import LoginStepper from "/src/components/LoginStepper/LoginStepper";
import TelaInicial from "/src/components/TelaInicial/TelaInicial";

export default function Home() {
    const [showStepper, setShowStepper] = useState(false);

    const handleStart = () => {
        setShowStepper(true);
    };

    return (
        <div>
            {showStepper ? <LoginStepper /> : <TelaInicial onStart={handleStart} />}
        </div>
    );
}