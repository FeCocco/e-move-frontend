const BotaoAzul = ({ className, children }) => {
    return (
        <button className={`bg-red-500 text-white px-4 py-2 rounded flex items-center justify-center gap-2 ${className}`}>
            {children}
        </button>
    );
};
export default BotaoAzul;
