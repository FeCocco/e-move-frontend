"use client";

import React from 'react';
import { cn } from "@/lib/utils";

const calculateStrength = (password) => {
    let score = 0;
    if (!password) {
        return 0;
    }
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)) score++;
    return score;
};

const MedidorForcaSenha = ({ password }) => {
    const strength = calculateStrength(password);

    const getStrengthProps = () => {
        if (!password) {
            return { level: '', color: '', text: '' };
        }
        if (strength <= 2) {
            return { level: 'weak', color: 'bg-vermelho-status', text: 'Senha Fraca' };
        }
        if (strength <= 4) {
            return { level: 'moderate', color: 'bg-amarelo-status', text: 'Senha Moderada' };
        }
        return { level: 'strong', color: 'bg-verde-claro', text: 'Senha Forte' };
    };

    const { level, color, text } = getStrengthProps();

    const strengthBarWidth = {
        '': '0%',
        'weak': '33%',
        'moderate': '66%',
        'strong': '100%',
    };

    return (
        <div className="mt-2 mb-0.5">
            <div className="relative h-2 w-full rounded-full bg-white/10">
                <div
                    className={cn("absolute h-2 rounded-full transition-all duration-300", color)}
                    style={{ width: strengthBarWidth[level] }}
                ></div>
            </div>
            {text && (
                <p className={cn(
                    "mt-1 text-xs transition-opacity duration-300",
                    level === 'weak' && 'text-vermelho-status',
                    level === 'moderate' && 'text-amarelo-status',
                    level === 'strong' && 'text-verde-claro'
                )}>
                    {text}
                </p>
            )}
        </div>
    );
}; export default MedidorForcaSenha;