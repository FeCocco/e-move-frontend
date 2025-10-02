"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Wrench, Database } from 'lucide-react';
import { SiNextdotjs, SiSpringboot } from "@icons-pack/react-simple-icons";

export default function Tecnologias() {
    const technologies = [
        {
            name: "Next.js",
            icon: SiNextdotjs,
            description: "O Next.js é a tecnologia que usamos para construir a interface visual do e-Move. Ele garante que o site seja rápido, moderno e funcione perfeitamente em qualquer dispositivo."
        },
        {
            name: "Spring Boot",
            icon: SiSpringboot,
            description: "O Spring Boot é o 'cérebro' da nossa aplicação. Ele cuida de toda a lógica complexa, como calcular as rotas e gerenciar os usuários de forma segura e eficiente."
        },
        {
            name: "MySQL",
            icon: Database,
            description: "O MySQL é nosso sistema de banco de dados, onde todas as informações são armazenadas de forma segura, desde os dados do seu perfil até os detalhes de cada ponto de recarga."
        }
    ];

    return (
        <section id="tecnologias" className="w-full bg-slate-900 py-20 px-6">
            <div className="max-w-7xl mx-auto text-center">

                <h2 className="text-5xl font-bold drop-shadow flex items-center justify-center gap-4 mb-16">
                    <Wrench size={48} className="text-green-400" />
                    <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent leading-snug">
                        Construído Com
                    </span>
                </h2>
                <div className="flex justify-center items-center gap-16 md:gap-24 flex-wrap">
                    {technologies.map((tech) => {
                        const IconComponent = tech.icon;
                        return (
                            <Dialog key={tech.name}>
                                <DialogTrigger asChild>
                                    <div className="text-center text-slate-400 hover:text-white transition-colors duration-300 cursor-pointer flex flex-col items-center gap-4">
                                        <IconComponent className="h-16 w-16 md:h-20 md:w-20" />
                                        <span className="font-semibold text-lg">{tech.name}</span>
                                    </div>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle className="flex items-center gap-3 text-2xl text-white mb-2">
                                            <IconComponent className="text-green-400 h-6 w-6" />
                                            {tech.name}
                                        </DialogTitle>
                                        <DialogDescription className="pt-4 text-left text-base text-slate-300/90 leading-relaxed">
                                            {tech.description}
                                        </DialogDescription>
                                    </DialogHeader>
                                </DialogContent>
                            </Dialog>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}