"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function ReachChat() {
  return (
    <Card className="bg-lightSecondary border-0 shadow-sm dark:bg-darkSecondary">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Post Reach</CardTitle>
        <div>
            <button className="bg-lightSecondary dark:bg-darkSecondary dark:border-lightSecondary border-darkSecondary border hover:bg-lightAccent/10 dark:hover:bg-lightAccent/10 rounded-2xl flex justify-center items-center gap-2 text-sm py-2 px-4">Weekly</button>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[250px] w-full" config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
