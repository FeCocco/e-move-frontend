import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const AppCard = ({ className, children }) => {
    return (
        <Card className={cn(
            // ANTES: "w-[448px] ..."
            // DEPOIS:
            "w-full max-w-md md:w-[448px]", // Ocupa 100% da largura até o limite de 'max-w-md', e a partir de telas médias (md), fixa em 448px
            "bg-white/[.08] backdrop-blur-md border-white/20 shadow-lg text-texto-claro overflow-hidden",
            className
        )}>
            {children}
        </Card>
    );
}; export default AppCard;