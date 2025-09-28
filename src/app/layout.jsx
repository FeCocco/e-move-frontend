'use client';

import { Orbitron, Poppins, Josefin_Sans } from "next/font/google";
import "./globals.css";
import Logo from "../components/Logo/Logo";
import Link from "next/link";
import Header from "@/components/Header/Header";
import { usePathname } from 'next/navigation';
import {Toaster} from "sonner";

const orbitron = Orbitron({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-orbitron" });
const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-poppins" });
const josefinSans = Josefin_Sans({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-josefin-sans" });

export default function RootLayout({ children }) {
    const pathname = usePathname();

    return (
        <html lang="pt-br">
        <head>
            <title>e-Move</title>
            <meta name="description" content="Plataforma de mobilidade elétrica" />
        </head>
        <body className={`${orbitron.variable} ${poppins.variable} ${josefinSans.variable} font-poppins`}>

        {/* O Header agora é sempre renderizado, mas recebe a rota atual como prop */}
        <Header pathname={pathname} />

        {/* O Logo também é sempre renderizado */}
        <Link href="/">
            <Logo className="fixed top-[25px] left-[30px] z-[1002] text-[1.6rem] text-azul-claro/70 drop-shadow-[0_0_8px_rgba(0,255,255,0.4)] cursor-pointer" />
        </Link>

        <main className="min-h-screen w-full bg-gradient-body flex flex-col">
            {children}
            <Toaster richColors position="top-right" />
        </main>
        </body>
        </html>
    );
}