import { useState } from "react";
import { AppCard } from "@/components/AppCard/AppCard";
import { useEstacoes } from "@/context/EstacoesContext";
import { Loader2, Zap, Star, MapPin, Info, MessageSquare, ThumbsUp, ThumbsDown, Phone, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

export default function AbaEstacoes() {
    const { favoritas, loading, toggleFavorita } = useEstacoes();
    const [selectedStation, setSelectedStation] = useState(null);

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
                                    {/* Badges de Conectores */}
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

            {/* --- MODAL DE DETALHES --- */}
            <Dialog open={!!selectedStation} onOpenChange={(open) => !open && setSelectedStation(null)}>
                <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
                    {selectedStation && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-xl font-bold text-azul-claro flex items-center gap-2">
                                    {selectedStation.AddressInfo.Title}
                                </DialogTitle>
                                <DialogDescription>
                                    {selectedStation.OperatorInfo?.Title || "Operador Desconhecido"}
                                </DialogDescription>
                            </DialogHeader>

                            {/* Aqui usamos uma div normal com overflow, substituindo o ScrollArea */}
                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
                                {/* Informações Básicas */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/5 p-4 rounded-lg">
                                    <div>
                                        <p className="text-xs text-texto-claro/50 uppercase font-bold mb-1">Endereço</p>
                                        <p className="text-sm text-white">
                                            {selectedStation.AddressInfo.AddressLine1}<br/>
                                            {selectedStation.AddressInfo.Town}, {selectedStation.AddressInfo.StateOrProvince}<br/>
                                            {selectedStation.AddressInfo.Postcode}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-texto-claro/50 uppercase font-bold mb-1">Status & Acesso</p>
                                        <p className="text-sm text-white mb-1">
                                            Status: <span className={selectedStation.StatusType?.IsOperational ? "text-verde-claro" : "text-vermelho-status"}>
                                                {selectedStation.StatusType?.Title || "Desconhecido"}
                                            </span>
                                        </p>
                                        <p className="text-sm text-texto-claro/80">
                                            {selectedStation.UsageType?.Title || "Acesso Público"}
                                        </p>
                                        <p className="text-sm text-texto-claro/80 mt-1">
                                            Custo: {selectedStation.UsageCost || "Não informado"}
                                        </p>
                                    </div>
                                </div>

                                {/* Contato e Web */}
                                {(selectedStation.OperatorInfo?.WebsiteURL || selectedStation.OperatorInfo?.PhonePrimaryContact) && (
                                    <div className="flex gap-4">
                                        {selectedStation.OperatorInfo?.WebsiteURL && (
                                            <a href={selectedStation.OperatorInfo.WebsiteURL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-azul-claro hover:underline text-sm">
                                                <Globe size={14}/> Website
                                            </a>
                                        )}
                                        {selectedStation.OperatorInfo?.PhonePrimaryContact && (
                                            <span className="flex items-center gap-2 text-texto-claro/80 text-sm">
                                                <Phone size={14}/> {selectedStation.OperatorInfo.PhonePrimaryContact}
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* Conectores */}
                                <div>
                                    <h4 className="text-sm font-bold text-white mb-3 border-b border-white/10 pb-1">Conectores Disponíveis</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {selectedStation.Connections?.map((conn, i) => (
                                            <div key={i} className="bg-black/40 p-3 rounded border border-white/5 flex justify-between items-center">
                                                <div>
                                                    <p className="text-sm font-medium text-azul-claro">{conn.ConnectionType?.Title || "Tipo Desconhecido"}</p>
                                                    <p className="text-xs text-texto-claro/60">{conn.Level?.Title}</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-lg font-bold text-white">{conn.PowerKW || "?"}</span> <span className="text-xs text-texto-claro/50">kW</span>
                                                    {conn.Quantity && <p className="text-xs text-texto-claro/50">x{conn.Quantity}</p>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Comentários da Comunidade */}
                                <div>
                                    <h4 className="text-sm font-bold text-white mb-3 border-b border-white/10 pb-1 flex items-center gap-2">
                                        <MessageSquare size={16}/> Comentários da Comunidade
                                    </h4>

                                    {selectedStation.UserComments && selectedStation.UserComments.length > 0 ? (
                                        <div className="space-y-3">
                                            {selectedStation.UserComments.map((comment, i) => (
                                                <div key={i} className="bg-white/5 p-3 rounded-lg">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className="font-bold text-sm text-azul-claro">{comment.UserName}</span>
                                                        <span className="text-xs text-texto-claro/40">
                                                            {new Date(comment.DateCreated).toLocaleDateString('pt-BR')}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${
                                                            comment.CheckinStatusType?.IsPositive ? 'bg-verde-claro/20 text-verde-claro' : 'bg-amarelo-status/20 text-amarelo-status'
                                                        }`}>
                                                            {comment.CheckinStatusType?.IsPositive ? <ThumbsUp size={10}/> : <ThumbsDown size={10}/>}
                                                            {comment.CheckinStatusType?.Title || "Check-in"}
                                                        </div>
                                                        {comment.Rating && (
                                                            <span className="text-xs text-amarelo-status">★ {comment.Rating}/5</span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-texto-claro/80 italic">"{comment.Comment}"</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-texto-claro/40 italic">Nenhum comentário recente.</p>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}