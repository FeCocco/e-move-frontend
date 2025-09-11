import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const AppCard = ({ className, children }) => {
    return (
        <Card className={cn(
            "w-full flex flex-col",
            "bg-white/[.08] backdrop-blur-md border-white/20 shadow-lg text-texto-claro overflow-hidden",
            // "max-h-[90vh]", // REMOVA OU COMENTE ESTA LINHA
            className
        )}>
            {children}
        </Card>
    );
};

const AppCardHeader = ({ className, children }) => {
    return (
        <CardHeader className={cn("flex-shrink-0", className)}>
            {children}
        </CardHeader>
    );
};

const AppCardContent = ({ className, children }) => {
    return (
        <CardContent className={cn("overflow-y-auto", className)}>
            {children}
        </CardContent>
    );
}; export { AppCard, AppCardHeader, AppCardContent }; // Exporte todos