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
import BackgroundSlider from "@/components/BackgroundSlider/BackgroundSlider";

export default function Home() {

    const pathname = usePathname();

    return (
        <div className="relative w-full min-h-screen">

            <BackgroundSlider />

            <div className="relative z-10">
                <Header pathname={pathname} />
                <TelaInicial />
                <SobreNos />
                <Roadmap />
                <Inovacao />
                <Suporte />
                <Tecnologias />
                <Footer />
                <BackToTopButton />
            </div>
        </div>
    );
}