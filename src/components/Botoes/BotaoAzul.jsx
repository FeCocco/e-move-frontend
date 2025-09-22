const BotaoAzul = ({ className, children, ...props }) => {
    return (
        <button
            className={`bg-blue-500 text-white px-4 py-2 rounded flex items-center justify-center gap-2 ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default BotaoAzul;