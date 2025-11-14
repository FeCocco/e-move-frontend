import { AppCard } from "@/components/AppCard/AppCard";
import { Loader2, AlertTriangle, History } from 'lucide-react';

import { useViagens } from "@/context/ViagensContext";

export default function AbaRotas() {

    // Consuma os dado do contexto
    const { historicoRotas, loading, error } = useViagens();

    // --- Renderização condicional para loading ---
    if (loading) {
        return (
            <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-azul-claro" />
                <p className="ml-2 text-texto-claro/80">Carregando histórico...</p>
            </div>
        );
    }

    // --- Renderização condicional para erro ---
    if (error) {
        return (
            <div className="flex flex-col justify-center items-center h-40 bg-vermelho-status/10 p-4 rounded-lg border border-vermelho-status/30">
                <AlertTriangle className="h-8 w-8 text-vermelho-status" />
                <p className="mt-2 text-vermelho-status">{error}</p>
                <p className="text-xs text-texto-claro/60">Verifique sua conexão ou se o backend está rodando.</p>
            </div>
        );
    }

    // --- Renderização principal ---
    return (
        <div>
            <div className="text-center mb-6">
                <h2 className="text-2xl font-orbitron text-verde-claro mb-2">Minhas Rotas</h2>
                <p className="text-texto-claro/80 max-w-2xl mx-auto">
                    Revise seu histórico de viagens e gerencie suas rotas favoritas.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 auto-rows-fr">

                {/* --- Card da Direita (3/4) --- */}
                <AppCard className="col-span-1 lg:col-span-3 bg-black/20 p-6 rounded-lg text-left">
                    <h3 className="text-lg font-semibold text-azul-claro text-center mb-4 p-4 border-b border-white/10">
                        Rotas Favoritas
                    </h3>
                    <div className="p-4 flex items-center justify-center h-full">
                        <p className="text-center text-texto-claro/60">
                            (Em breve: Aqui você poderá salvar e gerenciar suas rotas mais usadas)
                        </p>
                    </div>
                </AppCard>

                {/* --- Card da Esquerda (1/4) --- */}
                <AppCard className="col-span-1 flex flex-col h-full bg-black/20 p-6 rounded-lg text-left">
                    <h3 className="text-lg font-semibold text-azul-claro text-center mb-4 p-4 border-b border-white/10 flex items-center justify-center gap-2">
                        <History size={18} />
                        Histórico de Viagens
                    </h3>

                    <div className="flex-grow overflow-y-auto p-4 space-y-3">
                        {historicoRotas.length > 0 ? (
                            historicoRotas.map((rota) => (
                                <div key={rota.id_viagem} className="p-3 bg-black/30 rounded-lg border border-white/10 transition-all hover:border-azul-claro/50">
                                    <p className="font-semibold text-sm text-texto-claro">
                                        Data: {new Date(rota.dtViagem).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit', year: 'numeric'})}
                                    </p>
                                    <p className="text-xs text-texto-claro/80">
                                        Distância: {rota.kmTotal.toFixed(2)} km
                                    </p>
                                    <p className="text-xs text-texto-claro/80">
                                        CO₂ Salvo: {rota.co2Preservado.toFixed(2)} kg
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-texto-claro/60 text-center p-4">
                                Nenhuma rota no histórico ainda. Use a Aba 'Mapa' para salvar sua primeira viagem!
                            </p>
                        )}
                    </div>
                </AppCard>
            </div>
        </div>
    );
}