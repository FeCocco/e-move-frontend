import { AppCard } from "../AppCard/AppCard";

export default function Footer() {
  return (
    // Faz o wrapper ocupar a largura da viewport e anula padding/bg do AppCard
    <AppCard className="w-screen bg-transparent p-0">
      <footer
        id="contato"
        className="w-full bg-slate-900 py-16 px-6 border-t border-blue-500/20"
      >
        {/* Container centralizado com largura máxima */}
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-6">
            Entre em Contato
          </h2>

          <p className="text-slate-300 mb-2">
            Gostou do projeto? Quer saber mais ou se tornar um parceiro?
          </p>

          <p className="text-slate-300 mb-8">
            Envie um e-mail para:{" "}
            <a
              href="mailto:emovesuporte@gmail.com"
              className="text-green-400 hover:underline"
            >
              emovesuporte@gmail.com
            </a>
          </p>

          <div className="flex justify-center space-x-6 mb-8">
            <a
              href="#"
              className="text-slate-400 hover:text-green-400 text-2xl"
              aria-label="LinkedIn"
            >
              <i className="fab fa-linkedin" />
            </a>
            <a
              href="#"
              className="text-slate-400 hover:text-green-400 text-2xl"
              aria-label="GitHub"
            >
              <i className="fab fa-github" />
            </a>
            <a
              href="#"
              className="text-slate-400 hover:text-green-400 text-2xl"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram" />
            </a>
          </div>

          <p className="text-slate-500 text-sm">
            &copy; 2025 e-Move. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </AppCard>
  );
}
