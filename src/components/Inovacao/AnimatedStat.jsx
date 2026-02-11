"use client";
import { useEffect, useRef, useState } from "react";

function easeOutCubic(t) {
    return --t * t * t + 1;
}

function formatNumber(value, locale = "pt-BR", format = "full") {
    if (format === "compact") {
        // 100000000 -> "100 mi"
        return new Intl.NumberFormat(locale, {
            notation: "compact",
            compactDisplay: "short",
            maximumFractionDigits: 1,
        }).format(value);
    }

    // Padrão: 100000000 -> "100.000.000"
    return new Intl.NumberFormat(locale).format(value);
}

export default function AnimatedStat({
                                         icon: IconComponent,
                                         finalValue,
                                         label,
                                         prefix = "",
                                         numberFormat = "full", // "full" | "compact"
                                         locale = "pt-BR",
                                     }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    let startTimestamp = null;
                    const duration = 2500;

                    const step = (timestamp) => {
                        if (!startTimestamp) startTimestamp = timestamp;
                        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                        const easedProgress = easeOutCubic(progress);

                        setCount(Math.floor(easedProgress * finalValue));

                        if (progress < 1) window.requestAnimationFrame(step);
                    };

                    window.requestAnimationFrame(step);
                    // observer.unobserve(ref.current); // animação é feita somente uma vez
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [finalValue]);

    const formatted = formatNumber(count, locale, numberFormat);

    // se ainda ficar longo, reduz um pouco o tamanho automaticamente
    const isLong = String(formatted).length >= 10;
    const sizeClass = isLong ? "text-4xl lg:text-5xl" : "text-5xl lg:text-6xl";

    return (
        <div ref={ref} className="bg-slate-800 p-8 rounded-2xl flex flex-col items-center text-center">
            <IconComponent className="text-green-400 h-8 w-8 mb-4" strokeWidth={2.5} />

            <span className={`${sizeClass} font-bold text-white leading-none tabular-nums`}>
        {prefix ? (
            <span className="mr-2 align-baseline text-[0.65em] font-semibold tracking-normal text-white/80">
            {prefix}
          </span>
        ) : null}
                <span className="tracking-tighter">{formatted}</span>
      </span>

            <p className="text-slate-400 mt-2">{label}</p>
        </div>
    );
}