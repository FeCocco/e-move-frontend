import { Star } from 'lucide-react';

export default function StationPopup({ station, isFavorite, onToggleFavorite }) {
    const info = station.AddressInfo;
    const conn = station.Connections?.[0];

    return (
        <div className="p-2 text-slate-900 min-w-[220px]">
            <div className="flex justify-between items-start mb-2">
                <strong className="text-sm block mr-2">{info.Title}</strong>
                <button
                    onClick={() => onToggleFavorite(station)}
                    className="focus:outline-none transition-transform hover:scale-110"
                >
                    <Star
                        size={18}
                        className={isFavorite ? "fill-amarelo-status text-amarelo-status" : "text-slate-400 hover:text-amarelo-status"}
                    />
                </button>
            </div>

            <span className="text-xs text-slate-500 block mb-2 line-clamp-2">
                {info.AddressLine1 || 'Endereço não disponível'}
            </span>

            <div className="flex justify-between items-center">
                <div className="flex items-center gap-1 bg-verde-claro/10 p-1 rounded text-verde-claro text-xs font-bold">
                    {conn ? conn.PowerKW + ' kW' : 'N/A'}
                </div>
                <span className="text-xs text-slate-400">
                    {station.UsageCost || "Custo n/d"}
                </span>
            </div>
        </div>
    );
}