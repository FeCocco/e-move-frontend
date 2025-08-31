module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                orbitron: ['var(--font-orbitron)', 'sans-serif'],
                poppins: ['var(--font-poppins)', 'sans-serif'],
                'josefin-sans': ['var(--font-josefin-sans)', 'sans-serif'],
            },
            colors: {
                'azul-claro': '#00ffff',
                'verde-claro': '#00ff88',
                'texto-claro': '#f0f0f0',
                'amarelo-status': '#eedc3d',
                'vermelho-status': '#ff5555',
            },
            backgroundImage: {
                'gradient-body': 'linear-gradient(120deg, #0f2027, #203a43, #2c5364)',
            },
            // Adicionando a animação de fade-in para a Welcome Screen
            keyframes: {
                welcomeFadeIn: {
                    'from': { opacity: '0', transform: 'translateY(20px)' },
                    'to': { opacity: '1', transform: 'translateY(0)' },
                }
            },
            animation: {
                'welcome-fade-in': 'welcomeFadeIn 2s ease-in-out 0.5s forwards',
            }
        },
    },
    plugins: [],
};