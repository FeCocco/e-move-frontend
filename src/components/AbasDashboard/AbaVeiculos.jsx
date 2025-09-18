import { useState } from "react";
import VeiculoCard from "@/components/VeiculoCard/VeiculoCard";
import AdicionarVeiculo from "@/components/AppCard/AdicionarVeiculo";
import AdicionarVeiculoCard from "@/components/AppCard/AdicionarVeiculoCard";

export default function AbaVeiculos() {
    const [modalOpen, setModalOpen] = useState(false);

    const veiculos = [
        { id: 1, nome: "Veículo Elétrico Alpha", status: "Disponível", bateria: 80, autonomiaTotal: 550, autonomiaEstimada: 440 },
        { id: 2, nome: "Scooter Beta", status: "Em Manutenção", bateria: 45, autonomiaTotal: 50, autonomiaEstimada: 22.5 },
        { id: 3, nome: "Bike Elétrica Gamma", status: "Em Manutenção", bateria: 12, autonomiaTotal: 70, autonomiaEstimada: 8.4 },
    ];

    const handleEditar = (id) => console.log("Editar veículo", id);
    const handleExcluir = (id) => console.log("Excluir veículo", id);

    return (
        <div>
            <h2 className="text-2xl font-orbitron text-verde-claro mb-4">Meus Veículos</h2>
            <p>Conteúdo da aba de veículos aqui...</p>

            <div className="p-4 sm:p-5 md:p-6 rounded-lg flex flex-col space-y-4">
                <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6" id="vehicleGrid">
                    {veiculos.map((v) => (
                        <VeiculoCard
                            key={v.id}
                            nome={v.nome}
                            status={v.status}
                            bateria={v.bateria}
                            autonomiaTotal={v.autonomiaTotal}
                            autonomiaEstimada={v.autonomiaEstimada}
                            onEditar={() => handleEditar(v.id)}
                            onExcluir={() => handleExcluir(v.id)}
                        />
                    ))}

                    <AdicionarVeiculoCard onClick={() => setModalOpen(true)} />
                </div>
            </div>

            <AdicionarVeiculo isOpen={modalOpen} onClose={() => setModalOpen(false)} />
        </div>
    );
}
