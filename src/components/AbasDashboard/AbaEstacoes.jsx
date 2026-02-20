import { useEffect, useState } from "react";
import { AppCard } from "@/components/AppCard/AppCard";
import { useEstacoes } from "@/context/EstacoesContext";
import { Loader2, Zap, Star, MapPin, Info, MessageSquare, ThumbsUp, ThumbsDown, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription} from "@/components/ui/dialog";
import {traduzirAbaEstacoes, traduzirGeral} from "@/lib/dicionario";

export default function AbaEstacoes({ isActive = false }) {
    const { favoritas, loading, toggleFavorita, refetchFavoritas } = useEstacoes();
    const [selectedStation, setSelectedStation] = useState(null);

    useEffect(() => {
        if (isActive) {
            refetchFavoritas();
        }
    }, [isActive, refetchFavoritas]);

    if (loading) return <div className="flex justify-center h-40 items-center"><Loader2 className="animate-spin text-azul-claro"/></div>;

    return (
        <div>
            <h2 className="text-2xl font-orbitron text-verde-claro mb-4 text-center">Estações Favoritas</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoritas.length > 0 ? (
                    favoritas.map(estacao => (
                        <AppCard key={estacao.ID} className="bg-black/20 border-white/10 p-4 relative group flex flex-col justify-between h-full">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-white truncate pr-8" title={estacao.AddressInfo.Title}>
                                        {estacao.AddressInfo.Title}
                                    </h4>
                                    <button onClick={() => toggleFavorita(estacao)} className="text-amarelo-status hover:scale-110 transition-transform">
                                        <Star className="fill-amarelo-status" size={20} />
                                    </button>
                                </div>

                                <p className="text-sm text-texto-claro/70 mb-4 line-clamp-2 min-h-[40px]">
                                    <MapPin size={14} className="inline mr-1 text-verde-claro"/>
                                    {estacao.AddressInfo.AddressLine1}
                                    {estacao.AddressInfo.Town && `, ${estacao.AddressInfo.Town}`}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {estacao.Connections?.slice(0, 2).map((conn, idx) => (
                                        <div key={idx} className="bg-white/5 px-2 py-1 rounded text-xs text-azul-claro border border-white/10 flex items-center gap-1">
                                            <Zap size={12}/>
                                            {conn.PowerKW ? `${conn.PowerKW} kW` : 'AC'}
                                            {conn.ConnectionType?.Title && ` • ${conn.ConnectionType.Title}`}
                                        </div>
                                    ))}
                                    {estacao.Connections?.length > 2 && (
                                        <div className="bg-white/5 px-2 py-1 rounded text-xs text-texto-claro/60">
                                            +{estacao.Connections.length - 2}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Button
                                variant="ghost"
                                className="w-full border border-white/10 hover:bg-azul-claro/10 hover:text-azul-claro mt-auto"
                                onClick={() => setSelectedStation(estacao)}
                            >
                                <Info size={16} className="mr-2"/> Ver Detalhes
                            </Button>
                        </AppCard>
                    ))
                ) : (
                    <div className="col-span-full text-center text-texto-claro/50 py-10">
                        <Zap size={48} className="mx-auto mb-2 opacity-20"/>
                        <p>Nenhuma estação favorita encontrada.</p>
                        <p className="text-sm">Adicione estações através do Mapa durante suas rotas.</p>
                    </div>
                )}
            </div>

            <Dialog open={!!selectedStation} onOpenChange={(open) => !open && setSelectedStation(null)}>
                <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-hidden flex flex-col bg-slate-900 border-white/10 text-white">
                    {selectedStation && (
                        <>
                            <DialogHeader className="shrink-0">
                                <DialogTitle className="text-xl font-bold text-azul-claro flex items-center gap-2">
                                    {selectedStation.AddressInfo.Title}
                                </DialogTitle>
                                <DialogDescription className="text-slate-400">
                                    {selectedStation.OperatorInfo?.Title || "Operador Desconhecido"}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar mt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    <div className="space-y-4">
                                        <div>
                                            <p className="flex items-center gap-2 text-slate-300">
                                                <MapPin size={16} className="text-verde-claro"/>
                                                {selectedStation.AddressInfo.AddressLine1}
                                            </p>
                                            <p className="mt-2 text-slate-300">
                                                <strong>{traduzirGeral("Uso")}:</strong> {traduzirAbaEstacoes(selectedStation.UsageCost) || traduzirGeral("not_informed")}                                            </p>
                                        </div>

                                        <div>
                                            <h4 className="font-bold text-verde-claro mb-2 flex items-center gap-2">
                                                <Zap size={18} /> Conexões
                                            </h4>
                                            <ul className="space-y-2">
                                                {selectedStation.Connections?.map((conn, idx) => (
                                                    <li key={idx} className="bg-white/5 p-3 rounded-lg border border-white/10 flex justify-between items-center">
                                        <span className="font-medium text-azul-claro">
                                            {conn.ConnectionType?.Title || "Conector Desconhecido"}
                                        </span>
                                                        <span className="text-sm bg-verde-claro/20 text-verde-claro px-2 py-1 rounded">
                                            {conn.PowerKW ? `${conn.PowerKW} kW` : 'Potência N/A'}
                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-4 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="font-bold text-verde-claro flex items-center gap-2">
                                                <MessageSquare size={18} /> Comentários
                                            </h4>

                                            {/* BOTÃO PARA FUTURA IMPLEMENTAÇÃO */}
                                            <div
                                                title="Funcionalidade em desenvolvimento. Em breve!"
                                                className="inline-block cursor-not-allowed"
                                            >
                                                <div
                                                    title="Funcionalidade em desenvolvimento. Em breve!"
                                                    className="inline-block cursor-not-allowed"
                                                >
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        disabled
                                                        className="border border-white/10 text-slate-500 opacity-60 pointer-events-none"
                                                    >
                                                        Avaliar
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            {selectedStation.UserComments && selectedStation.UserComments.length > 0 ? (
                                                selectedStation.UserComments.map((comment, idx) => (
                                                    <div key={idx} className="bg-white/5 p-3 rounded-lg border border-white/10 text-sm">

                                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-bold text-slate-200 flex items-center gap-1">
                                                <User size={14} className="text-slate-400"/>
                                                {comment.UserName || "Anônimo"}
                                            </span>
                                                            {comment.DateCreated && (
                                                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                                    <Calendar size={12} />
                                                                    {new Date(comment.DateCreated).toLocaleDateString('pt-BR')}
                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="flex flex-wrap items-center gap-3 mb-2">
                                                            {comment.Rating && (
                                                                <div className="flex text-amarelo-status">
                                                                    {[...Array(comment.Rating)].map((_, i) => (
                                                                        <Star key={i} size={12} className="fill-amarelo-status" />
                                                                    ))}
                                                                </div>
                                                            )}

                                                            {comment.CheckinStatusType && (
                                                                <span className={`text-[10px] px-2 py-0.5 rounded flex items-center gap-1 ${
                                                                    comment.CheckinStatusType.IsPositive
                                                                        ? 'bg-verde-claro/10 text-verde-claro border border-verde-claro/20'
                                                                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                                                }`}>
                                                    {comment.CheckinStatusType.IsPositive ? <ThumbsUp size={10}/> : <ThumbsDown size={10}/>}
                                                                    {traduzirAbaEstacoes(comment.CheckinStatusType.Title)}
                                                </span>
                                                            )}
                                                        </div>

                                                        <p className="text-slate-300 italic">
                                                            "{comment.Comment || "Nenhum comentário por escrito."}"
                                                        </p>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-6 bg-white/5 rounded-lg border border-white/10 border-dashed">
                                                    <MessageSquare size={24} className="mx-auto text-slate-500 mb-2 opacity-50" />
                                                    <p className="text-sm text-slate-400">Nenhum comentário encontrado.</p>
                                                    <p className="text-xs text-slate-500 mt-1">Seja o primeiro a avaliar esta estação!</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}