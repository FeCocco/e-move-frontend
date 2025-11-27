"use client";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
    km: {
        label: "Distância (km)",
        color: "hsl(var(--azul-claro))",
    },
    co2: {
        label: "CO₂ Evitado (kg)",
        color: "hsl(var(--verde-claro))",
    },
};

export default function EvolucaoChart({ data }) {
    const temDados = data && data.some(d => d.km > 0);

    return (
        <main className="h-full flex flex-col">
            <CardHeader className="p-4 pb-0">
                <CardTitle className="text-lg">Evolução Mensal</CardTitle>
                <CardDescription>Seu impacto ambiental ao longo do tempo</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 p-4 min-h-[250px]">
                {temDados ? (
                    <ChartContainer config={chartConfig} className="h-full w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="fillKm" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-km)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--color-km)" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="fillCo2" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-co2)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--color-co2)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.1)" />
                                <XAxis
                                    dataKey="mes"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                />
                                <Tooltip content={<ChartTooltipContent />} cursor={{ stroke: 'rgba(255,255,255,0.2)' }} />

                                <Area
                                    type="monotone"
                                    dataKey="km"
                                    stroke="var(--color-km)"
                                    fillOpacity={1}
                                    fill="url(#fillKm)"
                                    strokeWidth={2}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="co2"
                                    stroke="var(--color-co2)"
                                    fillOpacity={1}
                                    fill="url(#fillCo2)"
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-texto-claro/40 text-sm">
                        <p>Dados insuficientes para gerar o gráfico.</p>
                        <p>Faça mais viagens para ver sua evolução!</p>
                    </div>
                )}
            </CardContent>
        </main>
    );
}