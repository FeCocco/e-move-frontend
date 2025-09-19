"use client";
import { useEffect, useRef, useState } from 'react';

function easeOutCubic(t) {
    return (--t) * t * t + 1;
}

export default function AnimatedStat({ icon: IconComponent, finalValue, label }) {
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

                        if (progress < 1) {
                            window.requestAnimationFrame(step);
                        }
                    };

                    window.requestAnimationFrame(step);
                    //observer.unobserve(ref.current); //animação é feita somente uma vez
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [finalValue]);

    return (
        <div ref={ref} className="bg-slate-800 p-8 rounded-2xl flex flex-col items-center text-center">
            <IconComponent className="text-green-400 h-8 w-8 mb-4" strokeWidth={2.5} />
            <span className="text-5xl lg:text-6xl font-bold text-white tracking-tighter">
                {count.toLocaleString('pt-BR')}
            </span>
            <p className="text-slate-400 mt-2">{label}</p>
        </div>
    );
};