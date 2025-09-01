'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function Template({ children }) {
    const pathname = usePathname();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}

                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}

                exit={{ opacity: 0, scale: 0.98 }}

                transition={{ ease: 'easeInOut', duration: 0.5 }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}