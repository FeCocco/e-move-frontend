import { AppCard } from "@/components/AppCard/AppCard";
import { Pencil, Trash2 } from "lucide-react";
import {Button} from "@/components/ui/button";

const VeiculoCard = ({ nome, status, bateria, autonomiaTotal, autonomiaEstimada, KmRodados, onEditar, onExcluir }) => {
    return (
        <AppCard className="p-4 bg-black/40 min-h-64 flex flex-col justify-between">
            <div>
                <h4 className="text-xl text-verde-claro">{nome}</h4>

                <div className="p-2 flex flex-col gap-2 mt-2">
                    <p className="text-gray-400/50">Status: <span>{status}</span> (em breve)</p>
                    <p>Autonomia total: <span>{autonomiaTotal} km</span></p>
                    <p>Bateria: <span className="text-white">{bateria}%</span></p>
                    <p>Autonomia Estimada: <span className="text-white">{autonomiaEstimada.toFixed(0)} km</span></p>
                    <p className="text-gray-400/50">KM Rodados: <span>{KmRodados} km</span> (em breve)</p>
                </div>
            </div>

            <div className="text-center pt-4 flex justify-between items-center">
                <Button onClick={onEditar} variant="botaoazul"><Pencil size={18}/> Editar</Button>
                <Button onClick={onExcluir} variant="botaovermelho"><Trash2 size={18}/> Excluir</Button>
            </div>
        </AppCard>
    );
};

export default VeiculoCard;