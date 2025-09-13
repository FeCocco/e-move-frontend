"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function BackToTopButton() {
    const [isVisible, setIsVisible] = useState(false);

    // Mostra o botão depois de rolar 300px para baixo
    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Leva o usuário de volta ao topo da página
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        window.addEventListener("scroll", toggleVisibility);
        return () => {
            window.removeEventListener("scroll", toggleVisibility);
        };
    }, []);

    return (
        <button
            onClick={scrollToTop}
            className={cn(
                "fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-green-400 text-slate-900 flex items-center justify-center text-2xl shadow-lg transition-all duration-300 hover:bg-green-300 hover:-translate-y-1",
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
            )}
            aria-label="Voltar ao topo"
        >
            <i className="fas fa-arrow-up"></i>
        </button>
    );
}