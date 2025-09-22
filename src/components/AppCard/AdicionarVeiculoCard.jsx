import { Plus } from "lucide-react";
import { AppCard } from "@/components/AppCard/AppCard";

const AdicionarVeiculoCard = (props) => {
    return (
        <AppCard
            className="p-4 bg-black/20 flex items-center justify-center cursor-pointer hover:bg-black/30 transition"
            {...props}
        >
            <Plus size={32} className="text-verde-claro" />
        </AppCard>
    );
};

export default AdicionarVeiculoCard;