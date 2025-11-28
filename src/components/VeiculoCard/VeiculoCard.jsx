import { AppCard } from "@/components/AppCard/AppCard";
import { Pencil, Trash2, Battery, Zap, Gauge, Car } from "lucide-react";
import { Button } from "@/components/ui/button";

const VeiculoCard = ({ nome, status, bateria, autonomiaTotal, autonomiaEstimada, KmRodados, onEditar, onExcluir }) => {

    // Define a cor da bateria baseada na carga
    let batteryColor = "text-verde-claro";
    let batteryFill = "bg-verde-claro";
    if (bateria <= 20) {
        batteryColor = "text-vermelho-status";
        batteryFill = "bg-vermelho-status";
    } else if (bateria <= 50) {
        batteryColor = "text-amarelo-status";
        batteryFill = "bg-amarelo-status";
    }

    return (
        <AppCard className="group relative p-0 bg-black/40 border-white/10 hover:border-azul-claro/50 transition-all duration-300 min-h-[320px] flex flex-col justify-between overflow-hidden">

            {/* Cabeçalho do Card com Ícone de Fundo */}
            <div className="p-6 pb-2 relative">
                <div className="absolute top-4 right-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Car size={100} />
                </div>
                <h4 className="text-xl font-bold text-white mb-1 truncate pr-8" title={nome}>{nome}</h4>
                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-verde-claro/10 px-2 py-1 text-xs font-medium text-verde-claro ring-1 ring-inset ring-verde-claro/20">
                        {status}
                    </span>
                </div>
            </div>

            {/* Corpo com Informações */}
            <div className="px-6 flex-grow flex flex-col justify-center gap-5">

                {/* Bateria com Barra de Progresso */}
                <div>
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-sm text-texto-claro/60 flex items-center gap-1"><Battery size={16}/> Bateria</span>
                        <span className={`text-xl font-bold ${batteryColor}`}>{bateria}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full ${batteryFill} transition-all duration-500`} style={{ width: `${bateria}%` }}></div>
                    </div>
                </div>

                {/* Grid de Autonomia */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                        <p className="text-xs text-texto-claro/50 mb-1 flex items-center gap-1"><Gauge size={14}/> Estimada</p>
                        <p className="text-lg font-semibold text-white">{autonomiaEstimada.toFixed(0)} <span className="text-xs font-normal">km</span></p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                        <p className="text-xs text-texto-claro/50 mb-1 flex items-center gap-1"><Zap size={14}/> Total</p>
                        <p className="text-lg font-semibold text-white">{autonomiaTotal} <span className="text-xs font-normal">km</span></p>
                    </div>
                </div>
            </div>

            {/* Rodapé com Ações */}
            <div className="p-4 mt-2 border-t border-white/5 flex gap-3">
                <Button onClick={onEditar} variant="ghost" className="flex-1 border border-white/10 hover:bg-azul-claro/10 hover:text-azul-claro h-10">
                    <Pencil size={16} className="mr-2"/> Editar
                </Button>
                <Button onClick={onExcluir} variant="ghost" className="flex-1 border border-white/10 hover:bg-vermelho-status/10 hover:text-vermelho-status hover:border-vermelho-status/30 h-10">
                    <Trash2 size={16} className="mr-2"/> Excluir
                </Button>
            </div>
        </AppCard>
    );
};

export default VeiculoCard;