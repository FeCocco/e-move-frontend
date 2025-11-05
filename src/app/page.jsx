'use client'

import TelaInicial from "@/components/TelaInicial/TelaInicial";
import SobreNos from "@/components/SobreNos/SobreNos";
import Inovacao from "@/components/Inovacao/Inovacao";
import Suporte from "@/components/Suporte/Suporte";
import Footer from "@/components/Footer/Footer";
import Roadmap from "@/components/Roadmap/Roadmap";
import BackToTopButton from "@/components/BackToTopButton/BackToTopButton";
import Tecnologias from "@/components/Tecnologias/Tecnologias";
import Header from "@/components/Header/Header";
import { usePathname } from 'next/navigation';

export default function Home() {

    const pathname = usePathname();

    return (
        <>
            <Header pathname={pathname} />
            <TelaInicial />
            <SobreNos />
            <Roadmap />
            <Inovacao />
            <Suporte />
            <Tecnologias />
            <Footer />
            <BackToTopButton />
        </>
    );
}