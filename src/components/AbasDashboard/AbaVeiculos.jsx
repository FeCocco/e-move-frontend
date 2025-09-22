import { useState, useMemo } from "react";
import VeiculoCard from "@/components/VeiculoCard/VeiculoCard";
import AdicionarVeiculoCard from "@/components/AppCard/AdicionarVeiculoCard";
import { useVeiculos } from "@/hooks/useVeiculos";

import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export default function AbaVeiculos() {
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editVehicle, setEditVehicle] = useState(null);
    const [vehicleToDelete, setVehicleToDelete] = useState(null);

    const { meusVeiculos, todosVeiculos, loading, error, adicionarVeiculo, removerVeiculo } = useVeiculos();

    const veiculosDisponiveis = useMemo(() => {
        const meusVeiculosIds = new Set(meusVeiculos.map(v => v.id));
        return todosVeiculos.filter(v => !meusVeiculosIds.has(v.id));
    }, [meusVeiculos, todosVeiculos]);

    if (loading) return <p>Carregando seus veículos...</p>;
    if (error) return <p className="text-vermelho-status">{error}</p>;

    const handleAdicionarVeiculo = (veiculoId) => {
        adicionarVeiculo(veiculoId);
        setAddModalOpen(false);
    };

    const handleConfirmarExclusao = () => {
        if (vehicleToDelete) {
            removerVeiculo(vehicleToDelete.id);
            setVehicleToDelete(null); // Fecha o alerta
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-orbitron text-verde-claro mb-4">Meus Veículos</h2>
            <p>Gerencie os veículos elétricos da sua garagem.</p>

            <div className="p-4 sm:p-5 md:p-6 rounded-lg">
                <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6" id="vehicleGrid">
                    {meusVeiculos.map((v) => (
                        <VeiculoCard
                            key={v.id}
                            nome={`${v.marca} ${v.modelo}`}
                            status="Disponível"
                            bateria={100}
                            autonomiaTotal={v.autonomia}
                            autonomiaEstimada={v.autonomia}
                            onEditar={() => setEditVehicle(v)}
                            onExcluir={() => setVehicleToDelete(v)} // <-- MUDANÇA: Abre o alerta de exclusão
                        />
                    ))}

                    {/* Modal de Adicionar Veículo */}
                    <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
                        <DialogTrigger asChild>
                            <AdicionarVeiculoCard />
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Adicionar Veículo à Garagem</DialogTitle>
                                <DialogDescription>
                                    Selecione um veículo da lista para adicioná-lo ao seu perfil.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col gap-2 max-h-80 overflow-y-auto py-4">
                                {veiculosDisponiveis.map(veiculo => (
                                    <div key={veiculo.id} className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
                                        <span>{veiculo.marca} {veiculo.modelo} ({veiculo.autonomia}km)</span>
                                        <Button onClick={() => handleAdicionarVeiculo(veiculo.id)} variant="botaoazul" size="sm">
                                            Adicionar
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Modal de Edição */}
            <Dialog open={!!editVehicle} onOpenChange={(isOpen) => !isOpen && setEditVehicle(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Veículo</DialogTitle>
                        <DialogDescription>
                            Aqui você poderá dar um apelido ou alterar outras informações do seu veículo no futuro.
                        </DialogDescription>
                    </DialogHeader>
                    {/* ... (conteúdo do modal de edição) ... */}
                </DialogContent>
            </Dialog>

            {/* Alerta de Confirmação de Exclusão */}
            <AlertDialog open={!!vehicleToDelete} onOpenChange={(isOpen) => !isOpen && setVehicleToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Tem a certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta ação não pode ser desfeita. Isto irá remover permanentemente o veículo
                            <strong> {vehicleToDelete?.marca} {vehicleToDelete?.modelo} </strong>
                            da sua garagem.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmarExclusao}>Continuar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}