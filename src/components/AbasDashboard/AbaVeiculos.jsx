import { useState, useMemo } from "react";
import VeiculoCard from "@/components/VeiculoCard/VeiculoCard";
import EditarBateriaModal from "@/components/EditarBateriaModal/EditarBateriaModal";
import { useVeiculos } from "@/context/VeiculosContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CarFront, Zap, BatteryCharging, Plus } from 'lucide-react';

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

    const resumo = useMemo(() => {
        const totalCarros = meusVeiculos.length;
        const autonomiaTotal = meusVeiculos.reduce((acc, v) => acc + (v.autonomiaEstimada || 0), 0);
        const mediaBateria = totalCarros > 0
            ? Math.round(meusVeiculos.reduce((acc, v) => acc + (v.nivelBateria || 0), 0) / totalCarros)
            : 0;
        return { totalCarros, autonomiaTotal, mediaBateria };
    }, [meusVeiculos]);

    if (loading) return <div className="flex justify-center p-10"><p className="text-azul-claro animate-pulse">Carregando sua garagem...</p></div>;
    if (error) return <p className="text-vermelho-status text-center p-10">{error}</p>;

    const handleAdicionarVeiculo = async (veiculoId) => {
        await adicionarVeiculo(veiculoId);
        setAddModalOpen(false);
        setSearchTerm("");
    };

    const handleConfirmarExclusao = async () => {
        if (vehicleToDelete) {
            await removerVeiculo(vehicleToDelete.id);
            setVehicleToDelete(null);
        }
    };

    const mailtoLink = `mailto:emovesuporte@gmail.com?subject=Solicitação de Novo Veículo&body=Olá...`;

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-2xl font-orbitron text-verde-claro mb-2">Meus Veículos</h2>
                <p className="text-texto-claro/80">Gerencie a autonomia e status da sua frota elétrica.</p>
            </div>

            {meusVeiculos.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
                    <div className="bg-black/20 border border-white/10 p-4 rounded-xl flex items-center justify-between">
                        <div>
                            <p className="text-sm text-texto-claro/60">Frota Total</p>
                            <p className="text-2xl font-bold text-white">{resumo.totalCarros} <span className="text-sm font-normal">veículos</span></p>
                        </div>
                        <CarFront className="text-azul-claro opacity-80" size={28} />
                    </div>
                    <div className="bg-black/20 border border-white/10 p-4 rounded-xl flex items-center justify-between">
                        <div>
                            <p className="text-sm text-texto-claro/60">Autonomia Somada</p>
                            <p className="text-2xl font-bold text-white">{resumo.autonomiaTotal.toFixed(0)} <span className="text-sm font-normal">km</span></p>
                        </div>
                        <Zap className="text-verde-claro opacity-80" size={28} />
                    </div>
                    <div className="bg-black/20 border border-white/10 p-4 rounded-xl flex items-center justify-between">
                        <div>
                            <p className="text-sm text-texto-claro/60">Carga Média</p>
                            <p className="text-2xl font-bold text-white">{resumo.mediaBateria}%</p>
                        </div>
                        <BatteryCharging className="text-amarelo-status opacity-80" size={28} />
                    </div>
                </div>
            )}

            <div className="p-2">
                <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6 max-w-7xl mx-auto" id="vehicleGrid">

                    {meusVeiculos.map((v) => (
                        <VeiculoCard
                            key={v.id}
                            nome={`${v.marca} ${v.modelo}`}
                            status="Disponível"
                            autonomiaTotal={v.autonomiaTotal}
                            bateria={v.nivelBateria}
                            autonomiaEstimada={v.autonomiaEstimada}
                            KmRodados={2000}
                            onEditar={() => setVehicleToEdit(v)}
                            onExcluir={() => setVehicleToDelete(v)}
                        />
                    ))}

                    <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
                        <DialogTrigger asChild>
                            <div className="group min-h-[320px] bg-black/20 border-2 border-dashed border-white/10 hover:border-verde-claro/50 hover:bg-verde-claro/5 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 gap-4">
                                {/* CORREÇÃO: Usamos o ícone Plus direto, sem envolver em outro card */}
                                <div className="w-16 h-16 rounded-full bg-white/5 group-hover:bg-verde-claro/20 flex items-center justify-center transition-colors">
                                    <Plus size={32} className="text-verde-claro" />
                                </div>
                                <p className="text-texto-claro/60 group-hover:text-verde-claro font-medium">Adicionar Novo Veículo</p>
                            </div>
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
                                        <div key={veiculo.id} className="flex justify-between items-center p-3 bg-slate-800 rounded-lg border border-white/5 hover:border-white/20 transition-colors">
                                            <span className="text-sm">{veiculo.marca} {veiculo.modelo} <span className="text-texto-claro/50">({veiculo.autonomia}km)</span></span>
                                            <Button onClick={() => handleAdicionarVeiculo(veiculo.id)} variant="botaoazul" size="sm" className="h-8">
                                                Adicionar
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-slate-400 p-4">
                                        <p>Nenhum veículo encontrado.</p>
                                        {searchTerm && (
                                            <p className="mt-4 text-sm">
                                                Não achou seu veículo? <a href={mailtoLink} className="text-azul-claro underline hover:text-azul-botao">Solicite aqui</a>.
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
                        <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta ação irá remover permanentemente o veículo <strong>{vehicleToDelete?.marca} {vehicleToDelete?.modelo}</strong> da sua garagem.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmarExclusao}>Remover Veículo</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}