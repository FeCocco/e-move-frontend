import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const AppCard = ({ className, children }) => {
    return (
        <Card className={cn(
            "w-[448px] bg-white/[.08] backdrop-blur-md border-white/20 shadow-lg text-texto-claro overflow-hidden",
            className
        )}>
            {children}
        </Card>
    );
}; export default AppCard;