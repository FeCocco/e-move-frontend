"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export default function Tecnologias() {
    // Array com os dados das tecnologias para facilitar a renderização
    const technologies = [
        {
            name: "Next.js",
            icon: "fab fa-react",
            description: "O Next.js é a tecnologia que usamos para construir a interface visual do e-Move. Ele garante que o site seja rápido, moderno e funcione perfeitamente em qualquer dispositivo."
        },
        {
            name: "Spring Boot",
            icon: "fab fa-java",
            description: "O Spring Boot é o 'cérebro' da nossa aplicação. Ele cuida de toda a lógica complexa, como calcular as rotas e gerenciar os usuários de forma segura e eficiente."
        },
        {
            name: "MySQL",
            icon: "fas fa-database",
            description: "O MySQL é nosso sistema de banco de dados, onde todas as informações são armazenadas de forma segura, desde os dados do seu perfil até os detalhes de cada ponto de recarga."
        }
    ];

    return (
        <section id="tecnologias" className="w-full bg-slate-900 py-32 px-6">
            <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-16 drop-shadow">
                    🛠️ Construído Com
                </h2>
                <div className="flex justify-center items-center gap-16 md:gap-24 flex-wrap">
                    {technologies.map((tech) => (
                        <Dialog key={tech.name}>
                            <DialogTrigger asChild>
                                <div className="text-center text-slate-400 hover:text-white transition-colors duration-300 cursor-pointer">
                                    <i className={`${tech.icon} text-7xl md:text-8xl`}></i>
                                    <span className="block mt-4 font-semibold text-lg">{tech.name}</span>
                                </div>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle className="flex items-center gap-3 text-2xl text-white mb-2">
                                        <i className={`${tech.icon} text-green-400`}></i>
                                        {tech.name}
                                    </DialogTitle>
                                    <DialogDescription className="pt-4 text-left text-base text-slate-300/90 leading-relaxed">
                                        {tech.description}
                                    </DialogDescription>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                    ))}
                </div>
            </div>
        </section>
    );
}