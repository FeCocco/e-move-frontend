'use client';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const navItems = [
    { id: '#AbaVeiculos', icon: 'fas fa-car', label: 'Meus Veículos' },
    { id: '#AbaRotas', icon: 'fas fa-route', label: 'Minhas Rotas' },
    { id: '#AbaEstacoes', icon: 'fas fa-charging-station', label: 'Estações' },
    { id: '#AbaMapa', icon: 'fas fa-map-marked-alt', label: 'Planejar Rota' },
    { id: '#AbaUsuarios', icon: 'fas fa-user-cog', label: 'Conta' },
];

const DashboardNav = ({ activeTab, setActiveTab }) => {
    const refs = useRef([]);
    const [indicatorStyle, setIndicatorStyle] = useState({ x: 0, width: 0 });

    useEffect(() => {
        const activeIndex = navItems.findIndex(item => item.id === activeTab);
        const activeTabElement = refs.current[activeIndex];

        setTimeout(() => {
            if (activeTabElement) {
                setIndicatorStyle({
                    x: activeTabElement.offsetLeft,
                    width: activeTabElement.offsetWidth,
                });
            }
        }, 50);

    }, [activeTab]);

    return (
        <nav className="relative flex justify-center p-1.5 bg-black/20 rounded-full shadow-inner">
            {navItems.map((item, index) => (
                <button
                    key={item.id}
                    ref={(el) => (refs.current[index] = el)}
                    onClick={() => setActiveTab(item.id)}
                    className={`relative z-10 flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors duration-300
                        ${activeTab === item.id ? 'text-black' : 'text-gray-300 hover:text-white'}`
                    }
                >
                    <i className={item.icon}></i>
                    <span className="hidden md:inline">{item.label}</span>
                </button>
            ))}

            <motion.div
                className="absolute top-1.5 left-0 h-[calc(100%-12px)] bg-gradient-to-r from-azul-claro to-azul-botao rounded-full shadow-[0_0_10px_rgba(0,255,255,0.5)]"
                animate={indicatorStyle}
                transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                }}
            />
        </nav>
    );
}; export default DashboardNav;