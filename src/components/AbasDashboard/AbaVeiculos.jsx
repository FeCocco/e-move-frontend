import { useState, useMemo } from "react";
import VeiculoCard from "@/components/VeiculoCard/VeiculoCard";
import AdicionarVeiculoCard from "@/components/AppCard/AdicionarVeiculoCard";
import { useVeiculos } from "@/hooks/useVeiculos";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function AbaVeiculos() {

    const [modalOpen, setModalOpen] = useState(false);
    const { meusVeiculos, todosVeiculos, loading, error, adicionarVeiculo, removerVeiculo } = useVeiculos();

    const veiculosDisponiveis = useMemo(() => {
        const meusVeiculosIds = new Set(meusVeiculos.map(v => v.id));
        return todosVeiculos.filter(v => !meusVeiculosIds.has(v.id));
    }, [meusVeiculos, todosVeiculos]);

    if (loading) {
        return <p>Carregando seus veículos...</p>;
    }

    if (error) {
        return <p className="text-vermelho-status">{error}</p>;
    }

    const handleAdicionarVeiculo = (veiculoId) => {
        adicionarVeiculo(veiculoId);
        setModalOpen(false);
    };

    return (
        <div>
            <h2 className="text-2xl font-orbitron text-verde-claro mb-4">Meus Veículos</h2>
            <p>Gerencie os veículos elétricos da sua garagem.</p>

            <div className="p-4 sm:p-5 md:p-6 rounded-lg flex flex-col space-y-4">
                <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6" id="vehicleGrid">
                    {meusVeiculos.map((v) => (
                        <VeiculoCard
                            key={v.id}
                            nome={`${v.marca} ${v.modelo}`}
                            status="Disponível"
                            bateria={100}
                            autonomiaTotal={v.autonomia}
                            autonomiaEstimada={v.autonomia}
                            onEditar={() => console.log("Editar veículo", v.id)}
                            onExcluir={() => removerVeiculo(v.id)}
                        />
                    ))}

                    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                        <DialogTrigger asChild>
                            <AdicionarVeiculoCard />
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Adicionar Veículo à Garagem</DialogTitle>
                                <DialogDescription>
                                    Selecione um veículo da lista abaixo para adicioná-lo ao seu perfil.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col gap-2 max-h-80 overflow-y-auto py-4">
                                {veiculosDisponiveis.length > 0 ? (
                                    veiculosDisponiveis.map(veiculo => (
                                        <div key={veiculo.id} className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
                                            <span className="text-texto-claro">{veiculo.marca} {veiculo.modelo} ({veiculo.autonomia}km)</span>
                                            <Button
                                                onClick={() => handleAdicionarVeiculo(veiculo.id)}
                                                variant="outline"
                                                size="sm"
                                            >
                                                Adicionar
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-400 py-8">Você já adicionou todos os veículos disponíveis.</p>
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}