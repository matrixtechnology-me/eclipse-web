"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

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

type RevenueData = {
  week: Array<{ day: string; revenue: number; profit: number }>;
  month: Array<{ week: string; revenue: number; profit: number }>;
  year: Array<{ month: string; revenue: number; profit: number }>;
};

type RevenueChartProps = {
  data: RevenueData;
  currency?: string;
};

const chartConfig = {
  revenue: {
    label: "Receita",
    color: "var(--chart-1)",
  },
  profit: {
    label: "Lucro",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function RevenueChart({ data, currency = "BRL" }: RevenueChartProps) {
  const [timePeriod, setTimePeriod] = useState<"week" | "month" | "year">(
    "month"
  );

  const getData = () => {
    return data[timePeriod];
  };

  const getXAxisKey = () => {
    if (timePeriod === "week") return "day";
    if (timePeriod === "month") return "week";
    return "month";
  };

  const getTitle = () => {
    if (timePeriod === "week") return "Última Semana";
    if (timePeriod === "month") return "Último Mês";
    return "Último Ano";
  };

  const formatValue = (value: unknown) => {
    const numValue = typeof value === "number" ? value : Number(value);
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numValue);
  };

  return (
    <Card className="bg-secondary/25">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Visão Geral de Receitas</CardTitle>
            <CardDescription>
              {getTitle()} - Receita vs Lucro ({currency})
            </CardDescription>
          </div>
          <Select
            value={timePeriod}
            onValueChange={(value: "week" | "month" | "year") =>
              setTimePeriod(value)
            }
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Última Semana</SelectItem>
              <SelectItem value="month">Último Mês</SelectItem>
              <SelectItem value="year">Último Ano</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={getData()}
            margin={{
              top: 20,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={getXAxisKey()}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  formatter={(value) => formatValue(value)}
                />
              }
            />
            <Line
              dataKey="revenue"
              type="natural"
              stroke="var(--color-revenue)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-revenue)",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
                formatter={(value: unknown) => formatValue(value)}
              />
            </Line>
            <Line
              dataKey="profit"
              type="natural"
              stroke="var(--color-profit)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-profit)",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
                formatter={(value: unknown) => formatValue(value)}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Receita aumentando 8,5% <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Mostrando desempenho {getTitle().toLowerCase()}
        </div>
      </CardFooter>
    </Card>
  );
}
