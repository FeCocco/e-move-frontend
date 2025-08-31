function Logo({ className }) {
    // O componente agora aplica qualquer classe que for passada para ele.
    // O estilo base 'font-orbitron' é mantido para consistência.
    return (
        <div className={`font-orbitron ${className}`}>
            <span className="text-verde-claro">e</span>-Move
        </div>
    );
} export default Logo;