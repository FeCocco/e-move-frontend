export default function Suporte() {
  return (
    <section id="suporte" className="py-32 px-6 max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-12 drop-shadow">
        🤔 Dúvidas Frequentes (FAQ)
      </h2>

      <div className="space-y-6 text-left">
        <div className="bg-slate-800 p-6 rounded-lg border-l-4 border-blue-500">
          <h4 className="text-green-400 font-semibold mb-2">Como o e-Move calcula as paradas?</h4>
          <p className="text-slate-300 text-sm">Nosso sistema cruza a distância total com a autonomia do carro, e indica os melhores pontos para recarga.</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg border-l-4 border-blue-500">
          <h4 className="text-green-400 font-semibold mb-2">Posso cadastrar mais de um veículo?</h4>
          <p className="text-slate-300 text-sm">Sim! Você pode cadastrar vários veículos e escolher qual usar ao planejar uma rota.</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg border-l-4 border-blue-500">
          <h4 className="text-green-400 font-semibold mb-2">Os meus dados estão seguros?</h4>
          <p className="text-slate-300 text-sm">Usamos autenticação JWT, senhas criptografadas e boas práticas para manter seus dados protegidos.</p>
        </div>
      </div>
    </section>
  );
}
