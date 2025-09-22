import { useState, useMemo } from "react";
import VeiculoCard from "@/components/VeiculoCard/VeiculoCard";
import AdicionarVeiculo from "@/components/AppCard/AdicionarVeiculo";
import AdicionarVeiculoCard from "@/components/AppCard/AdicionarVeiculoCard";
import { useVeiculos } from "@/hooks/useVeiculos";

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

                    <AdicionarVeiculoCard onClick={() => setModalOpen(true)} />
                </div>
            </div>

            <AdicionarVeiculo
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                veiculosDisponiveis={veiculosDisponiveis}
                onAdicionar={adicionarVeiculo}
            />
        </div>
    );
}