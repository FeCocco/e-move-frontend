import { useState, useMemo } from "react";
import VeiculoCard from "@/components/VeiculoCard/VeiculoCard";
import AdicionarVeiculoCard from "@/components/AppCard/AdicionarVeiculoCard";
import EditarBateriaModal from "@/components/EditarBateriaModal/EditarBateriaModal";
import { useVeiculos } from "@/hooks/useVeiculos";

import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AbaVeiculos() {
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [vehicleToEdit, setVehicleToEdit] = useState(null);
    const [vehicleToDelete, setVehicleToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const {
        meusVeiculos,
        todosVeiculos,
        loading,
        error,
        adicionarVeiculo,
        removerVeiculo,
        atualizarNivelBateria
    } = useVeiculos();

    const veiculosDisponiveis = useMemo(() => {
        const meusVeiculosIds = new Set(meusVeiculos.map(v => v.id));
        if (!searchTerm) {
            return todosVeiculos.filter(v => !meusVeiculosIds.has(v.id));
        }
        return todosVeiculos.filter(v =>
            !meusVeiculosIds.has(v.id) &&
            `${v.marca} ${v.modelo}`.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [meusVeiculos, todosVeiculos, searchTerm]);

    if (loading) return <p>Carregando seus veículos...</p>;
    if (error) return <p className="text-vermelho-status">{error}</p>;

    const handleAdicionarVeiculo = async (veiculoId) => {
        await adicionarVeiculo(veiculoId); // Espera a função terminar
        setAddModalOpen(false);
        setSearchTerm("");
    };

    const handleConfirmarExclusao = async () => {
        if (vehicleToDelete) {
            await removerVeiculo(vehicleToDelete.id); // Espera a função terminar
            setVehicleToDelete(null);
        }
    };

    const mailtoLink = `mailto:emovesuporte@gmail.com?subject=Solicitação de Novo Veículo&body=Olá, equipe e-Move!%0D%0A%0D%0AGostaria de solicitar a adição do seguinte veículo à plataforma:%0D%0A%0D%0A- Marca / Modelo: ${searchTerm}%0D%0A%0D%0A[Por favor, adicione mais detalhes que você conheça, como ano e autonomia em km, se possível.]`;


    return (
        <div>
            <div className="flex justify-center flex-col">
                <h2 className="flex justify-center text-2xl font-orbitron text-verde-claro mb-4">Meus Veículos</h2>
                <p>Gerencie os veículos elétricos da sua garagem.</p>
            </div>
            <div className="p-4 sm:p-5 md:p-6 rounded-lg">
                <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6" id="vehicleGrid">
                    {meusVeiculos.map((v) => (
                        <VeiculoCard
                            key={v.id}
                            nome={`${v.marca} ${v.modelo}`}
                            status="Disponível" // A ser implementado
                            autonomiaTotal={v.autonomiaTotal}
                            bateria={v.nivelBateria}
                            autonomiaEstimada={v.autonomiaEstimada}
                            KmRodados={2000} // A ser implementado
                            onEditar={() => setVehicleToEdit(v)}
                            onExcluir={() => setVehicleToDelete(v)}
                        />
                    ))}

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

                            <Input
                                placeholder="Pesquisar por marca ou modelo..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-white/5 border-white/30 placeholder:text-white/50 focus-visible:ring-azul-claro"
                            />

                            <div className="flex flex-col gap-2 max-h-80 overflow-y-auto py-4">
                                {veiculosDisponiveis.length > 0 ? (
                                    veiculosDisponiveis.map(veiculo => (
                                        <div key={veiculo.id} className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
                                            <span>{veiculo.marca} {veiculo.modelo} ({veiculo.autonomia}km)</span>
                                            <Button onClick={() => handleAdicionarVeiculo(veiculo.id)} variant="botaoazul" size="sm">
                                                Adicionar
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-slate-400 p-4">
                                        <p>Nenhum veículo encontrado.</p>
                                        {searchTerm && (
                                            <p className="mt-4 text-sm">
                                                Não achou seu veículo elétrico? <a href={mailtoLink} className="text-azul-claro underline hover:text-azul-botao">Solicite a adição</a> ao time de desenvolvimento.
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <EditarBateriaModal
                isOpen={!!vehicleToEdit}
                onClose={() => setVehicleToEdit(null)}
                veiculo={vehicleToEdit}
                onSave={atualizarNivelBateria}
            />

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