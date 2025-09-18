import {AppCard} from "@/components/AppCard/AppCard";

export default function AbaVeiculos(){
    return(
        <div>
            <h2 className="text-2xl font-orbitron text-verde-claro mb-4">Meus Veículos</h2>
            <p>Conteúdo da aba de veículos aqui...</p>
            <div className=" p-4 sm:p-5 md:p-6 rounded-lg flex flex-col space-y-4">
                <div  className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6" id="vehicleGrid">
                    <AppCard className="p-4 bg-black/20">
                        <h4>Veículo Elétrico Alpha</h4>
                        <div>
                            <p>Status: <span>Disponível</span></p>
                            <p>Bateria: <span>80%</span></p>
                            <p>Autonomia total: <span>550 km</span></p>
                            <p>Autonomia Estimada: <span>440 km</span></p>
                        </div>
                        <div className="pt-4">
                            <button><i></i> Editar</button>
                            <button><i></i> Excluir</button>
                        </div>
                    </AppCard>
                    <AppCard className="p-4 bg-black/20">
                        <h4>Scooter Beta</h4>
                        <div>
                            <p>Status: <span>Em Manutenção</span></p>
                            <p>Bateria: <span>45%</span></p>
                            <p>Autonomia total: <span>50 km</span></p>
                            <p>Autonomia Estimada: <span>22.5 km</span></p>
                        </div>
                        <div>
                            <button><i></i> Editar</button>
                            <button><i></i> Excluir</button>
                        </div>
                    </AppCard>
                    <div>
                        <h4>Bike Elétrica Gamma</h4>
                        <div>
                            <p>Status: <span>Em Manutenção</span></p>
                            <p>Bateria: <span>12% (Recarregando)</span></p>
                            <p>Autonomia total: <span>70 km</span></p>
                            <p>Autonomia Estimada: <span>8.4 km</span></p>
                        </div>
                        <div>
                            <button><i></i> Editar</button>
                            <button><i></i> Excluir</button>
                        </div>
                    </div>
                    <div>
                        <h4>Patinete Delta</h4>
                        <div>
                            <p>Status: <span>Disponível</span></p>
                            <p>Bateria: <span>95%</span></p>
                            <p>Autonomia total: <span>20 km</span></p>
                            <p>Autonomia Estimada: <span>19 km</span></p>
                        </div>
                        <div>
                            <button><i class="fa-solid fa-pencil"></i> Editar</button>
                            <button><i class="fa-solid fa-trash-can"></i> Excluir</button>
                        </div>
                    </div>
                    <div id="addVehicleCard">
                        <div>
                            <i></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}