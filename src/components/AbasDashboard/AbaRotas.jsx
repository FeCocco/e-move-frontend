import { AppCard } from "@/components/AppCard/AppCard";
import { Loader2, AlertTriangle, History, Star, MapPin } from 'lucide-react';
import { useViagens } from "@/context/ViagensContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function AbaRotas() {
    const { historicoRotas, loading, error, toggleFavorito } = useViagens();

    // Estado para controlar o modal de favoritar
    const [rotaParaFavoritar, setRotaParaFavoritar] = useState(null);
    const [apelidoTemp, setApelidoTemp] = useState("");

    const handleStarClick = (rota) => {
        if (rota.favorita) {
            // Se já é favorita, desfavorita direto (remove apelido)
            toggleFavorito(rota.id_viagem, false, null);
        } else {
            // Se não é, abre o modal para pedir apelido
            setApelidoTemp(rota.apelido || "");
            setRotaParaFavoritar(rota);
        }
    };

    // Salva quando clica em "Salvar" no modal
    const confirmarFavorito = async () => {
        if (rotaParaFavoritar) {
            await toggleFavorito(rotaParaFavoritar.id_viagem, true, apelidoTemp);
            setRotaParaFavoritar(null); // Fecha modal
            setApelidoTemp("");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-azul-claro" />
                <p className="ml-2 text-texto-claro/80">Carregando histórico...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center h-40 bg-vermelho-status/10 p-4 rounded-lg border border-vermelho-status/30">
                <AlertTriangle className="h-8 w-8 text-vermelho-status" />
                <p className="mt-2 text-vermelho-status">{error}</p>
            </div>
        );
    }

    // Filtra apenas as favoritas para o card da direita
    const rotasFavoritas = historicoRotas.filter(r => r.favorita);

    return (
        <div>
            <div className="text-center mb-6">
                <h2 className="text-2xl font-orbitron text-verde-claro mb-2">Minhas Rotas</h2>
                <p className="text-texto-claro/80 max-w-2xl mx-auto">
                    Revise seu histórico de viagens e gerencie suas rotas favoritas.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 auto-rows-fr">

                {/* --- Card da Direita (Favoritas - 3/4) --- */}
                <AppCard className="col-span-1 lg:col-span-3 bg-black/20 p-6 rounded-lg text-left">
                    <h3 className="text-lg font-semibold text-azul-claro text-center mb-4 p-4 border-b border-white/10 flex items-center justify-center gap-2">
                        <Star className="fill-azul-claro text-azul-claro" size={18} />
                        Rotas Favoritas
                    </h3>

                    <div className="flex-grow overflow-y-auto p-2 space-y-3 max-h-[500px]">
                        {rotasFavoritas.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {rotasFavoritas.map((rota) => (
                                    <div key={rota.id_viagem} className="p-4 bg-white/5 rounded-xl border border-azul-claro/30 hover:border-azul-claro transition-colors relative group">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-lg text-white">{rota.apelido || "Rota sem nome"}</h4>
                                            <button
                                                onClick={() => handleStarClick(rota)}
                                                className="text-amarelo-status hover:scale-110 transition-transform"
                                                title="Remover dos favoritos"
                                            >
                                                <Star className="fill-amarelo-status text-amarelo-status" size={20} />
                                            </button>
                                        </div>
                                        <div className="space-y-1 text-sm text-texto-claro/70">
                                            <p className="flex items-center gap-2"><MapPin size={14} className="text-verde-claro"/> Distância: {rota.kmTotal.toFixed(2)} km</p>
                                            <p className="flex items-center gap-2"><History size={14} className="text-azul-claro"/> Data: {new Date(rota.dtViagem).toLocaleDateString('pt-BR')}</p>
                                        </div>
                                        {/* Botão para "Carregar no Mapa" poderia ir aqui futuramente */}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-40 text-texto-claro/60">
                                <Star size={48} className="mb-2 opacity-20" />
                                <p>Você ainda não favoritou nenhuma rota.</p>
                                <p className="text-xs">Clique na estrela ao lado de uma viagem no histórico.</p>
                            </div>
                        )}
                    </div>
                </AppCard>

                {/* --- Card da Esquerda (Histórico - 1/4) --- */}
                <AppCard className="col-span-1 flex flex-col h-full bg-black/20 p-6 rounded-lg text-left">
                    <h3 className="text-lg font-semibold text-azul-claro text-center mb-4 p-4 border-b border-white/10 flex items-center justify-center gap-2">
                        <History size={18} />
                        Histórico
                    </h3>

                    <div className="flex-grow overflow-y-auto p-2 space-y-3 max-h-[500px] pr-2">
                        {historicoRotas.length > 0 ? (
                            historicoRotas.map((rota) => (
                                <div key={rota.id_viagem} className="p-3 bg-black/30 rounded-lg border border-white/10 transition-all hover:border-azul-claro/50 flex flex-col gap-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-sm text-texto-claro">
                                                {new Date(rota.dtViagem).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                            </p>
                                            {rota.apelido && <p className="text-xs text-azul-claro font-medium">{rota.apelido}</p>}
                                        </div>

                                        {/* Botão da Estrela */}
                                        <button
                                            onClick={() => handleStarClick(rota)}
                                            className="transition-transform hover:scale-110 focus:outline-none"
                                        >
                                            <Star
                                                size={18}
                                                className={rota.favorita
                                                    ? "text-amarelo-status fill-amarelo-status"
                                                    : "text-texto-claro/30 hover:text-amarelo-status"
                                                }
                                            />
                                        </button>
                                    </div>

                                    <div className="flex justify-between text-xs text-texto-claro/70 pt-1 border-t border-white/5">
                                        <span>{rota.kmTotal.toFixed(1)} km</span>
                                        <span className="text-verde-claro">-{rota.co2Preservado.toFixed(1)}kg CO₂</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-texto-claro/60 text-center p-4">
                                Nenhuma rota no histórico ainda.
                            </p>
                        )}
                    </div>
                </AppCard>
            </div>

            {/* --- Modal para Adicionar Apelido --- */}
            <Dialog open={!!rotaParaFavoritar} onOpenChange={(open) => !open && setRotaParaFavoritar(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Favoritar Rota</DialogTitle>
                        <DialogDescription>
                            Dê um nome para esta rota para encontrá-la facilmente depois.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center space-x-2 py-4">
                        <div className="grid flex-1 gap-2">
                            <Label htmlFor="apelido" className="sr-only">
                                Apelido
                            </Label>
                            <Input
                                id="apelido"
                                placeholder="Ex: Casa -> Trabalho"
                                value={apelidoTemp}
                                onChange={(e) => setApelidoTemp(e.target.value)}
                                className="bg-white/5 border-white/30 text-white"
                                autoFocus
                            />
                        </div>
                    </div>
                    <DialogFooter className="sm:justify-end">
                        <Button variant="ghost" onClick={() => setRotaParaFavoritar(null)}>
                            Cancelar
                        </Button>
                        <Button variant="botaoazul" onClick={confirmarFavorito}>
                            Salvar Favorito
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}