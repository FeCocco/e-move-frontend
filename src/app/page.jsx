import TelaInicial from "@/components/TelaInicial/TelaInicial";
import Header from "@/components/Header/Header";
import SobreNos from "@/components/SobreNos/SobreNos";
import Inovacao from "@/components/Inovacao/Inovacao";
import Suporte from "@/components/Suporte/Suporte";
import Footer from "@/components/Footer/Footer";

export default function Home() {
  return (
    <>
      {/* Tela Inicial - full screen no topo */}
      <TelaInicial />

      {/* Restante da landing page */}
      <Header />
      <main>
        <SobreNos />
        <Inovacao />
        <Suporte />
      </main>
      <Footer />
    </>
  );
}
