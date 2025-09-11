import { AppCard } from "../AppCard/AppCard";

export default function Inovacao() {
  return (
    <section id="inovacao" className="py-32 px-6 max-w-6xl mx-auto">
        <AppCard className="p-8">
      <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-6 drop-shadow">
        💡 Inovação e Tecnologia
      </h2>
      <p className="max-w-3xl mx-auto text-lg text-slate-300 leading-relaxed mb-12">
        Construímos uma plataforma inteligente que funciona como o copiloto perfeito para sua viagem elétrica.
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 text-left">
        <div className="bg-slate-900 p-6 rounded-xl border border-blue-500/20 hover:-translate-y-2 transition">
          <i className="fas fa-map-location-dot text-green-400 text-2xl mb-4"></i>
          <h4 className="text-white font-semibold mb-2">Planejamento de Rota Inteligente</h4>
          <p className="text-slate-300 text-sm leading-relaxed">Insira a origem e o destino. Nosso algoritmo calcula a melhor rota e adiciona paradas ideais de recarga.</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-xl border border-blue-500/20 hover:-translate-y-2 transition">
          <i className="fas fa-car-battery text-green-400 text-2xl mb-4"></i>
          <h4 className="text-white font-semibold mb-2">Gestão de Veículos</h4>
          <p className="text-slate-300 text-sm leading-relaxed">Cadastre seus veículos elétricos em seu perfil, com autonomia real.</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-xl border border-blue-500/20 hover:-translate-y-2 transition">
          <i className="fas fa-charging-station text-green-400 text-2xl mb-4"></i>
          <h4 className="text-white font-semibold mb-2">Base de Estações</h4>
          <p className="text-slate-300 text-sm leading-relaxed">Usamos a OpenChargeMap com milhares de pontos de recarga e detalhes completos.</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-xl border border-blue-500/20 hover:-translate-y-2 transition">
          <i className="fas fa-shield-halved text-green-400 text-2xl mb-4"></i>
          <h4 className="text-white font-semibold mb-2">Segurança e Tecnologia</h4>
          <p className="text-slate-300 text-sm leading-relaxed">Backend em Spring Boot + frontend em Next.js, com dados protegidos.</p>
        </div>
      </div>
      </AppCard>
    </section>
  );
}
