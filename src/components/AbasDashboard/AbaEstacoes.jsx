import { useEffect, useState } from "react";
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

                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
                                {/* ... existente ... */}
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}