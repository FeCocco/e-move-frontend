"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

const backgroundImages = [
    "/foto1.jpeg",
    "/foto2.jpeg",
    "/foto3.jpeg",
    "/foto4.jpeg",
];

export default function BackgroundSlider() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) =>
                prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
            );
        }, 6000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className="absolute top-0 left-0 w-full h-[500px] md:h-[600px] z-0 overflow-hidden pointer-events-none select-none"
            // 'mask-image' cria um degradê de opacidade real.
            // black_40% = A imagem é 100% visível até 40% da altura.
            // transparent_100% = A imagem desaparece completamente ao chegar no final.
            style={{
                maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)'
            }}
        >
            {backgroundImages.map((src, index) => (
                <div
                    key={src}
                    className={`absolute inset-0 w-full h-full transition-opacity duration-[3000ms] ease-in-out ${
                        index === currentImageIndex ? 'opacity-40' : 'opacity-0'
                    }`}
                >
                    <Image
                        src={src}
                        alt="Background texture"
                        fill
                        priority={index === 0}
                        className="object-cover grayscale" // deixa sem saturaçcao de cor
                    />
                </div>
            ))}

            <div className="absolute inset-0 bg-azul-claro/10 mix-blend-overlay"></div>
        </div>
    );
}