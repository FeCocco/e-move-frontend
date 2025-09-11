import { AppCard } from "../AppCard/AppCard";

export default function SobreNos() {
  return (
    <section id="sobre-nos" className="py-32 px-6 max-w-6xl mx-auto">
        <AppCard className="mb-56 p-8">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-6 drop-shadow">
                🚀 Nossa Missão
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-slate-300 leading-relaxed mb-12">
                O <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent font-bold">e-Move</span> nasceu para eliminar a "ansiedade de autonomia" dos motoristas de veículos elétricos. Nossa missão é transformar a mobilidade elétrica no Brasil em algo <strong>simples, confiável e acessível</strong>, facilitando a transição para um futuro mais sustentável.
            </p>
        </AppCard>
      <h3 className="text-2xl font-semibold text-white mb-8">👥 A Equipe</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <div className="bg-slate-800 p-6 rounded-2xl shadow hover:-translate-y-2 hover:shadow-lg transition">
          <i className="fas fa-code text-blue-400 text-3xl"></i>
          <h4 className="mt-4 text-green-400 font-semibold">Felipe Giacomini Cocco</h4>
          <span className="text-slate-400">116525</span>
        </div>
        <div className="bg-slate-800 p-6 rounded-2xl shadow hover:-translate-y-2 hover:shadow-lg transition">
          <i className="fas fa-database text-blue-400 text-3xl"></i>
          <h4 className="mt-4 text-green-400 font-semibold">Fernando Gabriel Perinotto</h4>
          <span className="text-slate-400">115575</span>
        </div>
        <div className="bg-slate-800 p-6 rounded-2xl shadow hover:-translate-y-2 hover:shadow-lg transition">
          <i className="fas fa-bolt text-blue-400 text-3xl"></i>
          <h4 className="mt-4 text-green-400 font-semibold">Jhonatas Kévin de Oliveira Braga</h4>
          <span className="text-slate-400">116707</span>
        </div>
        <div className="bg-slate-800 p-6 rounded-2xl shadow hover:-translate-y-2 hover:shadow-lg transition">
          <i className="fas fa-laptop-code text-blue-400 text-3xl"></i>
          <h4 className="mt-4 text-green-400 font-semibold">Lucas Santos Souza</h4>
          <span className="text-slate-400">116852</span>
        </div>
        <div className="bg-slate-800 p-6 rounded-2xl shadow hover:-translate-y-2 hover:shadow-lg transition">
          <i className="fas fa-network-wired text-blue-400 text-3xl"></i>
          <h4 className="mt-4 text-green-400 font-semibold">Samuel Wilson Rufino</h4>
          <span className="text-slate-400">117792</span>
        </div>
      </div>
    </section>
  );
}
