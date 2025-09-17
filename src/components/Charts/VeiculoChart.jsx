"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";

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
    { veiculo: "Tesla Model 3", uso: 186 },
    { veiculo: "Nissan Leaf", uso: 305 },
    { veiculo: "BYD Dolphin", uso: 237 },
    { veiculo: "Bolt EV", uso: 73 },
    { veiculo: "Outro", uso: 209 },
].sort((a, b) => b.uso - a.uso); // Ordena do maior para o menor

const chartConfig = {
    uso: {
        label: "Uso",
        color: "var(--chart-2)",
    },
    label: {
        color: "var(--background)",
    },
};


export default function VeiculoChart() {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Veículos Mais Utilizados</CardTitle>
                <CardDescription>Baseado no histórico de viagens</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ right: 16 }}
                        accessibilityLayer
                    >
                        <CartesianGrid horizontal={false} />
                        <YAxis
                            dataKey="veiculo"
                            type="category"
                            tickLine={false}
                            axisLine={false}
                            width={100}
                        />
                        <XAxis dataKey="uso" type="number" hide />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <Bar
                            dataKey="uso"
                            layout="vertical"
                            fill="var(--chart-2)"
                            radius={4}
                        >
                            {/* Nome do veículo à esquerda */}
                            <LabelList
                                dataKey="veiculo"
                                position="insideLeft"
                                offset={8}
                                className="fill-(--color-label)"
                                fontSize={12}
                            />
                            {/* Quantidade à direita */}
                            <LabelList
                                dataKey="uso"
                                position="right"
                                offset={8}
                                className="fill-foreground"
                                fontSize={12}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                    Uso total subiu 5.2% este mês <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none">
                    Comparativo baseado nas últimas viagens
                </div>
            </CardFooter>
        </Card>
    );
}
