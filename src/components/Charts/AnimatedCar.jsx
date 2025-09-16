"use client";
import { motion } from 'framer-motion';
import { Car } from 'lucide-react';

const AnimatedCar = () => {
    return (
        <div className="relative w-full h-10 overflow-hidden">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-600"></div>

            <div className="absolute top-1/2 left-0 w-full h-0.5">
                <motion.div
                    className="w-full h-full"
                    style={{
                        backgroundImage: 'repeating-linear-gradient(90deg, #f1f5f9, #f1f5f9 10px, transparent 10px, transparent 20px)',
                        backgroundSize: '30px 2px',
                        backgroundPosition: '0 50%',
                    }}
                    animate={{ backgroundPosition: ['0% 50%', '-30px 50%'] }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                />
            </div>

            <motion.div
                className="absolute top-1/2"
                animate={{
                    left: ['-10%', '110%'],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'easeInOut'
                }}
                style={{ y: '-75%' }}
            >
                <Car className="h-6 w-6 text-azul-claro" />
            </motion.div>
        </div>
    );
};

export default AnimatedCar;