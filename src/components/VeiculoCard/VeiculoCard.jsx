import { AppCard } from "@/components/AppCard/AppCard";
import { Pencil, Trash2 } from "lucide-react";
import {Button} from "@/components/ui/button";

const VeiculoCard = ({ veiculo, onEditar, onExcluir }) => {
    const { marca, modelo, nivelBateria, autonomia, autonomiaEstimada } = veiculo;
    const nome = `${marca} ${modelo}`;

    return (
        <AppCard className="p-4 bg-black/40 min-h-64 flex flex-col justify-between">
            <div>
                <h4 className="text-xl text-verde-claro">{nome}</h4>

                <div className="p-2 flex flex-col gap-2 mt-2">
                    <p>Bateria: <span className="text-white">{nivelBateria}%</span></p>
                    <p>Autonomia Estimada: <span className="text-white">{autonomiaEstimada.toFixed(2)} km</span></p>
                    <p>Autonomia Total: <span className="text-gray-400/80">{autonomia} km</span></p>
                    <p className="text-gray-400/50">Status: <span>Disponível</span></p>
                    <p className="text-gray-400/50">KM Rodados: <span>N/A</span></p>
                </div>
            </div>

            <div className="text-center pt-4 flex justify-between items-center">
                <Button onClick={() => onEditar(veiculo)} variant="botaoazul"><Pencil size={18}/> Editar</Button>
                <Button onClick={() => onExcluir(veiculo.id)} variant="botaovermelho"><Trash2 size={18}/> Excluir</Button>
            </div>
        </AppCard>
    );
};

export default VeiculoCard;