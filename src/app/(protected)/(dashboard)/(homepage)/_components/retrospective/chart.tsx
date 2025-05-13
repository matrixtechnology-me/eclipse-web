"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  ResponsiveContainer,
} from "recharts";
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

interface MonthlyFinancialData {
  month: string;
  revenue: number;
  cost: number;
  profit: number;
}

interface ChartProps {
  data: MonthlyFinancialData[];
  growthPercentage?: number;
}

const chartConfig = {
  revenue: {
    label: "Receita",
    color: "var(--chart-1)",
  },
  cost: {
    label: "Custo",
    color: "var(--chart-2)",
  },
  profit: {
    label: "Lucro",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export const Chart = ({ data, growthPercentage = 0 }: ChartProps) => {
  const chartData = data.map((item) => ({
    ...item,
    month: new Date(item.month).toLocaleString("pt-BR", { month: "short" }),
  }));

  const currentMonth = new Date().toLocaleString("pt-BR", { month: "long" });

  return (
    <Card className="flex flex-col bg-secondary/25">
      <CardHeader>
        <CardTitle>Desempenho Financeiro</CardTitle>
        <CardDescription>Últimos 12 meses</CardDescription>
      </CardHeader>

      <CardContent className="h-fit bg-transparent">
        <ChartContainer
          config={chartConfig}
          className="w-full h-80 bg-transparent"
        >
          <div className="flex flex-col gap-4 h-80">
            <div className="flex gap-4">
              {Object.entries(chartConfig).map(([key, { label, color }]) => (
                <div key={key} className="flex items-center">
                  <div
                    className="mr-2 h-3 w-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm">{label}</span>
                </div>
              ))}
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                >
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value) => `R$ ${Number(value).toFixed(2)}`}
                      />
                    }
                  />
                  <Line
                    dataKey="revenue"
                    stroke="var(--color-revenue)"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    dataKey="cost"
                    stroke="var(--color-cost)"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    dataKey="profit"
                    stroke="var(--color-profit)"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col items-start gap-1 pt-0">
        <div className="flex items-center gap-2 text-sm font-medium">
          {growthPercentage >= 0 ? (
            <>
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span>
                Crescimento de {growthPercentage.toFixed(2)}% este mês
              </span>
            </>
          ) : (
            <>
              <TrendingDown className="h-4 w-4 text-red-500" />
              <span>
                Queda de {Math.abs(growthPercentage).toFixed(2)}% este mês
              </span>
            </>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          Período: {currentMonth} e meses anteriores
        </div>
      </CardFooter>
    </Card>
  );
};
