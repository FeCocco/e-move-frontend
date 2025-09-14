"use client";
import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, value, unit, label }) => {
    return (
        <motion.div
            className="bg-slate-800/50 p-4 rounded-lg text-center"
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(0,0,0,0.3)' }}
            transition={{ type: 'spring', stiffness: 300 }}
        >
            <Icon className="h-6 w-6 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">
                {value} <span className="text-base font-normal text-slate-400">{unit}</span>
            </p>
            <p className="text-xs text-slate-400">{label}</p>
        </motion.div>
    );
};

export default StatCard;