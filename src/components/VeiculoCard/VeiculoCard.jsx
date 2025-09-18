import { AppCard } from "@/components/AppCard/AppCard";
import BotaoAzul from "@/components/Botoes/BotaoAzul";
import BotaoVermelho from "@/components/Botoes/BotaoVermelho";
import { Pencil, Trash2 } from "lucide-react";

const VeiculoCard = ({ nome, status, bateria, autonomiaTotal, autonomiaEstimada, onEditar, onExcluir }) => {
    return (
        <AppCard className="p-4 bg-black/20">
            <h4 className="text-xl text-verde-claro">{nome}</h4>

            <div className="p-2 flex flex-col gap-2">
                <p>Status: <span>{status}</span></p>
                <p>Bateria: <span>{bateria}%</span></p>
                <p>Autonomia total: <span>{autonomiaTotal} km</span></p>
                <p>Autonomia Estimada: <span>{autonomiaEstimada} km</span></p>
            </div>

            <div className="text-center pt-4 flex justify-between items-center">
                <BotaoAzul onClick={onEditar}><Pencil size={18}/> Editar</BotaoAzul>
                <BotaoVermelho onClick={onExcluir}><Trash2 size={18}/> Excluir</BotaoVermelho>
            </div>
        </AppCard>
    );
};

export default VeiculoCard;
