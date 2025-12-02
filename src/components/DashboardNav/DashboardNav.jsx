'use client';
import { useState, useRef, useEffect } from 'react';
import { UserRoundCog, Gauge, MapPinned, EvCharger, Route, Car } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
    { id: '#AbaRelatorio', icon: () => <Gauge size={18} />, label: 'Relatório' },
    { id: '#AbaVeiculos', icon: () => <Car size={18} />, label: 'Veículos' },
    { id: '#AbaRotas', icon: () => <Route size={18} />, label: 'Rotas' },
    { id: '#AbaEstacoes', icon: () => <EvCharger size={18} />, label: 'Estações' },
    { id: '#AbaMapa', icon: () => <MapPinned size={18} />, label: 'Mapa' },
    { id: '#AbaUsuarios', icon: () => <UserRoundCog size={18} />, label: 'Conta' },
];

const DashboardNav = ({ activeTab, setActiveTab }) => {
    const itemRefs = useRef(new Map());
    const navRef = useRef(null);
    const [indicatorStyle, setIndicatorStyle] = useState({ x: 0, width: 0, opacity: 0 });

    useEffect(() => {
        const calculateIndicatorStyle = () => {
            const activeItem = navItems.find(item => item.id === activeTab);
            if (!activeItem) return;

            const activeTabElement = itemRefs.current.get(activeItem.id);

            if (activeTabElement) {
                setIndicatorStyle({
                    x: activeTabElement.offsetLeft,
                    width: activeTabElement.offsetWidth,
                    opacity: 1,
                });
            }
        };

        if (!navRef.current) return;

        const observer = new ResizeObserver(() => {
            calculateIndicatorStyle();
        });

        observer.observe(navRef.current);

        return () => {
            observer.disconnect();
        };
    }, [activeTab]);

    return (
        <nav
            ref={navRef}
            className="relative flex justify-center items-center h-[48px] max-w-[95vw] px-1.5 bg-black/20 rounded-full shadow-inner overflow-hidden">
            {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                    <button
                        key={item.id}
                        ref={(el) => {
                            if (el) itemRefs.current.set(item.id, el);
                            else itemRefs.current.delete(item.id);
                        }}
                        onClick={() => setActiveTab(item.id)}
                        className={`relative z-10 flex h-full items-center gap-1 md:gap-2 rounded-full px-3 sm:px-4 md:px-5 text-sm font-medium leading-none transition-colors duration-300 max-w-fit border-0
                            ${isActive ? 'text-black' : 'text-gray-300 hover:text-white'}`
                        }
                    >
                        {item.icon()}
                        <span className={`hidden md:inline`}>{item.label}</span>
                        <span className={`md:hidden ${isActive ? 'inline' : 'hidden'}`}>{item.label}</span>
                    </button>
                );
            })}

            <motion.div
                className="absolute top-1.5 bottom-1.5 left-0 bg-gradient-to-r from-azul-claro to-azul-botao rounded-full shadow-[0_0_10px_rgba(0,255,255,0.5)]"
                animate={indicatorStyle}
                transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                }}
            />
        </nav>
    );
};

export default DashboardNav;