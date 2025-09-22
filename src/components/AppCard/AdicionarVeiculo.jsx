import React from 'react';
import BotaoAzul from "@/components/Botoes/BotaoAzul";

const AdicionarVeiculo = ({ isOpen, onClose, veiculosDisponiveis, onAdicionar }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="modal-content bg-black/90 p-6 rounded-lg relative w-full max-w-md">
                <button
                    className="close-modal-btn absolute top-2 right-3 text-2xl font-bold"
                    onClick={onClose}
                >
                    &times;
                </button>

                <h2 id="modalTitle" className="text-xl text-verde-claro mb-4">Adicionar Veículo à sua Garagem</h2>

                <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
                    {veiculosDisponiveis.length > 0 ? (
                        veiculosDisponiveis.map(veiculo => (
                            <div key={veiculo.id} className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
                                <span>{veiculo.marca} {veiculo.modelo} ({veiculo.autonomia}km)</span>
                                <BotaoAzul
                                    onClick={() => {
                                        onAdicionar(veiculo.id);
                                        onClose();
                                    }}
                                >
                                    Adicionar
                                </BotaoAzul>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-400">Nenhum veículo novo para adicionar.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdicionarVeiculo;