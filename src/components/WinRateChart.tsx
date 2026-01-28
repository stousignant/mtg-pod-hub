import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3 } from "lucide-react";
import type { PodLeaderboardEntry } from "@/data/mockData";

interface WinRateChartProps {
  data: PodLeaderboardEntry[];
  isLoading: boolean;
  selectedPod: string;
}

const WinRateChart = ({ data, isLoading, selectedPod }: WinRateChartProps) => {
  const chartData = data
    .map((player) => ({
      name: player.player_name.split(" ")[0], // Use first name for mobile
      fullName: player.player_name,
      winRate: player.win_rate,
    }))
    .sort((a, b) => b.winRate - a.winRate);

  // Purple to blue gradient colors for bars
  const getBarColor = (index: number) => {
    const colors = [
      "hsl(270, 80%, 55%)", // Purple
      "hsl(250, 75%, 55%)",
      "hsl(230, 70%, 55%)",
      "hsl(220, 70%, 55%)", // Blue
    ];
    return colors[index % colors.length];
  };

  if (isLoading) {
    return (
      <Card className="glow-blue">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glow-blue border-secondary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-secondary" />
          Win Rate by Player - {selectedPod}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: "hsl(var(--border))" }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: "hsl(var(--border))" }}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--foreground))",
              }}
              formatter={(value: number) => [`${value.toFixed(1)}%`, "Win Rate"]}
              labelFormatter={(label) => {
                const player = chartData.find((d) => d.name === label);
                return player?.fullName || label;
              }}
            />
            <Bar
              dataKey="winRate"
              radius={[4, 4, 0, 0]}
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(index)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default WinRateChart;
