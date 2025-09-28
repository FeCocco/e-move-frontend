// src/components/AbasDashboard/AbaVeiculos.jsx
import { useState } from 'react';
import { useVeiculos } from '@/hooks/useVeiculos';
import VeiculoCard from '@/components/VeiculoCard/VeiculoCard';
import AdicionarVeiculoCard from "@/components/AppCard/AdicionarVeiculoCard";
import { EditarBateriaModal } from '@/components/EditarBateriaModal/EditarBateriaModal';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const AbaVeiculos = () => {
    const { meusVeiculos, todosVeiculos, loading, error, adicionarVeiculo, removerVeiculo, atualizarNivelBateria } = useVeiculos();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [veiculoSelecionado, setVeiculoSelecionado] = useState(null);

    const handleOpenEditModal = (veiculo) => {
        setVeiculoSelecionado(veiculo);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setVeiculoSelecionado(null);
        setIsEditModalOpen(false);
    };

    const veiculosDisponiveis = todosVeiculos.filter(
        (v) => !meusVeiculos.some((meuV) => meuV.id === v.id)
    );

    if (loading) return <p className="text-center">Carregando seus veículos...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div>
            <h3 className="text-2xl font-semibold mb-4 text-azul-claro">Meus Veículos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {meusVeiculos.map((veiculo) => (
                    <VeiculoCard
                        key={veiculo.id}
                        veiculo={veiculo}
                        onEditar={handleOpenEditModal}
                        onExcluir={removerVeiculo}
                    />
                ))}
                <AdicionarVeiculoCard onClick={() => setIsAddModalOpen(true)} />
            </div>

            {/* Modal para Adicionar Veículo */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="bg-gray-800 text-white border-gray-700">
                    <DialogHeader>
                        <DialogTitle>Adicionar Novo Veículo</DialogTitle>
                        <DialogDescription>
                            Selecione um veículo da lista para adicionar à sua garagem.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4 max-h-80 overflow-y-auto">
                        {veiculosDisponiveis.length > 0 ? (
                            veiculosDisponiveis.map((veiculo) => (
                                <div key={veiculo.id} className="flex justify-between items-center p-2 hover:bg-gray-700 rounded">
                                    <span>{veiculo.marca} {veiculo.modelo}</span>
                                    <Button onClick={() => {
                                        adicionarVeiculo(veiculo.id);
                                        setIsAddModalOpen(false);
                                    }}>Adicionar</Button>
                                </div>
                            ))
                        ) : (
                            <p>Nenhum veículo novo para adicionar.</p>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Modal para Editar Bateria */}
            {veiculoSelecionado && (
                <EditarBateriaModal
                    veiculo={veiculoSelecionado}
                    isOpen={isEditModalOpen}
                    onClose={handleCloseEditModal}
                    onSave={atualizarNivelBateria}
                />
            )}
        </div>
    );
};

export default AbaVeiculos;