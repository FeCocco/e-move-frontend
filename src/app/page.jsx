import TelaInicial from "@/components/TelaInicial/TelaInicial";
import Header from "@/components/Header/Header";
import SobreNos from "@/components/SobreNos/SobreNos";
import Roadmap from "@/components/Roadmap/Roadmap";
import Inovacao from "@/components/Inovacao/Inovacao";
import Suporte from "@/components/Suporte/Suporte";
import Tecnologias from "@/components/Tecnologias/Tecnologias";
import Footer from "@/components/Footer/Footer";
import BackToTopButton from "@/components/BackToTopButton/BackToTopButton";

export default function Home() {
    return (
        <>
            <Header />
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