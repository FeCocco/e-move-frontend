"use client";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis, ResponsiveContainer } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "Ranking de veículos mais utilizados";

const chartData = [
    { veiculo: "Nissan Leaf", uso: 305 },
    { veiculo: "BYD Dolphin", uso: 237 },
    { veiculo: "Porsche Taycan", uso: 209 },
    { veiculo: "Tesla Model 3", uso: 186 },
    { veiculo: "Bolt EV", uso: 73 },
];

const chartConfig = {
    uso: {
        label: "Uso",
        color: "hsl(var(--verde-claro))",
    },
};

const CustomYAxisTick = (props) => {
    const { x, y, payload } = props;
    return (
        <g transform={`translate(${x},${y})`}>
            <text x={0} y={0} dy={4} textAnchor="end" fill="#FFFFFF" fontSize={12}>
                {payload.value}
            </text>
        </g>
    );
};

export default function VeiculoChart() {
    return (
        <main className="h-full flex flex-col">
            <CardHeader className="p-2">
                <CardTitle>Veículos Mais Utilizados</CardTitle>
                <CardDescription>Baseado no histórico de viagens</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0 p-2">
                <ChartContainer config={chartConfig} className="h-full w-full">
                    <ResponsiveContainer>
                        <BarChart
                            data={chartData}
                            layout="vertical"
                            margin={{ left: 10, right: 30, top: 10, bottom: 10 }}
                            accessibilityLayer
                        >
                            <CartesianGrid horizontal={false} stroke="rgba(255, 255, 255, 0.1)" />
                            <YAxis
                                dataKey="veiculo"
                                type="category"
                                tickLine={false}
                                axisLine={false}
                                width={100}
                                interval={0}
                                tick={<CustomYAxisTick />}
                            />
                            <XAxis dataKey="uso" type="number" hide />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent
                                    indicator="line"
                                    // A className customizada foi removida daqui
                                />}
                            />
                            <Bar
                                dataKey="uso"
                                layout="vertical"
                                fill="var(--color-uso)"
                                radius={4}
                            >
                                <LabelList
                                    dataKey="uso"
                                    position="right"
                                    offset={8}
                                    className="fill-white font-bold"
                                    fontSize={12}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm p-2 pt-4">
                <div className="flex gap-2 leading-none font-medium items-center">
                    Uso total subiu 5.2% este mês <TrendingUp className="h-4 w-4 text-green-400" />
                </div>
                <div className="text-muted-foreground leading-none">
                    Comparativo baseado nas últimas viagens
                </div>
            </CardFooter>
        </main>
    );
}