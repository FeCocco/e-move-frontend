"use client";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
    uso: { label: "Viagens", color: "hsl(var(--verde-claro))" },
};

const CustomYAxisTick = ({ x, y, payload }) => (
    <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={4} textAnchor="end" fill="#FFFFFF" fontSize={11}>
            {payload.value.length > 12 ? payload.value.substring(0, 12) + "..." : payload.value}
        </text>
    </g>
);

export default function VeiculoChart({ data }) {
    const temDados = data && data.length > 0;

    return (
        <main className="h-full flex flex-col">
            <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg">Veículos Favoritos</CardTitle>
                <CardDescription>Modelos mais utilizados em suas rotas</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0 p-2 flex items-center justify-center h-[200px]">
                {temDados ? (
                    <ChartContainer config={chartConfig} className="h-full w-full">
                        <ResponsiveContainer>
                            <BarChart data={data} layout="vertical" margin={{ left: 5, right: 40, top: 10, bottom: 10 }}>
                                <CartesianGrid horizontal={false} stroke="rgba(255, 255, 255, 0.1)" />
                                <YAxis dataKey="veiculo" type="category" tickLine={false} axisLine={false} width={85} interval={0} tick={<CustomYAxisTick />} />
                                <XAxis dataKey="uso" type="number" hide />
                                <ChartTooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} content={<ChartTooltipContent indicator="line" />} />
                                <Bar dataKey="uso" layout="vertical" fill="var(--color-uso)" radius={4} barSize={24}>
                                    <LabelList dataKey="uso" position="right" offset={8} className="fill-white font-bold" fontSize={12} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                ) : (
                    <div className="text-center text-texto-claro/40 text-sm">
                        <p>Nenhum veículo registrado.</p>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-xs p-4 pt-2 text-muted-foreground">
                Contagem baseada no histórico total.
            </CardFooter>
        </main>
    );
}