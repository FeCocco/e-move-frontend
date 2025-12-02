'use client';

import { cn } from "@/lib/utils";

const GenderSelector = ({ value, onChange }) => {
    const options = [
        { label: "Masculino", value: "MASCULINO" },
        { label: "Feminino", value: "FEMININO" },
        { label: "Outros", value: "OUTROS" },
    ];

    return (
        <div className="flex w-full rounded-lg border border-white/30 bg-white/5 p-1">
            {options.map((option) => (
                <button
                    key={option.value}
                    type="button"
                    onClick={() => onChange(option.value)}
                    className={cn(
                        "flex-1 rounded-md py-2 text-center text-sm font-medium transition-colors",
                        value === option.value
                            ? "bg-azul-botao text-white shadow-md"
                            : "text-texto-claro/70 hover:bg-white/10"
                    )}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}; export default GenderSelector;