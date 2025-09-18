import { useState } from "react";

const AdicionarVeiculo = ({ isOpen, onClose }) => {
    const [bateria, setBateria] = useState(100);

    if (!isOpen) return null; // Modal não renderiza se fechado

    return (
        <div className="modal-overlay fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="modal-content bg-black/90 p-6 rounded-lg relative w-full max-w-md">
                <button
                    className="close-modal-btn absolute top-2 right-3 text-2xl font-bold"
                    onClick={onClose}
                >
                    &times;
                </button>

                <h2 id="modalTitle" className="text-xl text-verde-claro mb-4">Adicionar Novo Veículo</h2>

                <form id="addVehicleForm" className="flex flex-col gap-4">
                    <input type="hidden" id="vehicleType" />

                    <label htmlFor="vehicleName">Nome do Veículo</label>
                    <input type="text" id="vehicleName" placeholder="Ex: Patinete Foxtrot" required className="input"/>

                    <label htmlFor="vehicleStatus">Status</label>
                    <select id="vehicleStatus" required className="input">
                        <option value="available">Disponível</option>
                        <option value="maintenance">Em Manutenção</option>
                        <option value="charging">Recarregando</option>
                    </select>

                    <label htmlFor="vehicleBattery">Nível da Bateria (%)</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="range"
                            id="vehicleBatteryRange"
                            min="0"
                            max="100"
                            value={bateria}
                            onChange={(e) => setBateria(Number(e.target.value))}
                            className="flex-1"
                        />
                        <input
                            type="number"
                            id="vehicleBattery"
                            min="0"
                            max="100"
                            value={bateria}
                            onChange={(e) => setBateria(Number(e.target.value))}
                            required
                            className="w-20 input"
                        />
                    </div>

                    <label htmlFor="vehicleAutonomyTotal">Autonomia Total (km)</label>
                    <input type="number" id="vehicleAutonomyTotal" placeholder="Ex: 50" required className="input"/>

                    <button type="submit" className="btn-submit mt-2">Adicionar Veículo</button>
                </form>
            </div>
        </div>
    );
};

export default AdicionarVeiculo;
