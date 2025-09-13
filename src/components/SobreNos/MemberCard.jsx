"use client";

import { useRef, useEffect } from 'react';

export default function MemberCard({ icon: IconComponent, name, id, animation }) {
    const cardRef = useRef(null);

    useEffect(() => {
        const card = cardRef.current;
        if (!card) return;

        let animationFrameId = null;

        const handleMouseMove = (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const rotateX = -y / 15;
            const rotateY = x / 15;

            cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(() => {
                card.style.transition = 'transform 0.1s ease-out';
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
            });
        };

        const handleMouseLeave = () => {
            cancelAnimationFrame(animationFrameId);
            card.style.transition = 'transform 0.5s ease-in-out';
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        };

        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            card.removeEventListener('mousemove', handleMouseMove);
            card.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <div
            ref={cardRef}
            className="bg-slate-800 p-8 rounded-2xl shadow-xl transition-all duration-300 flex flex-col items-center hover:shadow-2xl hover:shadow-blue-500/20 cursor-default"
        >
            <IconComponent className={`text-blue-400 h-10 w-10 mb-5 ${animation}`} strokeWidth={2} />
            <h4 className="text-lg text-green-400 font-semibold">{name}</h4>
            <span className="text-slate-400 text-sm mt-1">{id}</span>
        </div>
    );
}