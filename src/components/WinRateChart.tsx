import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { BarChart3 } from 'lucide-react'
import type { PodLeaderboardEntry } from '@/data/mockData'
import { CHART, UI } from '@/constants/config'

interface WinRateChartProps {
  data: PodLeaderboardEntry[]
  isLoading: boolean
  selectedPod: string
}

const WinRateChart = ({ data, isLoading, selectedPod }: WinRateChartProps) => {
  const chartData = data
    .map(player => ({
      name: player.player_name.split(' ')[0], // Use first name for mobile
      fullName: player.player_name,
      winRate: player.win_rate,
    }))
    .sort((a, b) => b.winRate - a.winRate)

  // Purple to blue gradient colors for bars
  const getBarColor = (index: number) => {
    return CHART.GRADIENT_COLORS[index % CHART.GRADIENT_COLORS.length]
  }

  if (isLoading) {
    return (
      <Card className="glow-blue">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className={`h-[${CHART.HEIGHT}px] w-full`} />
        </CardContent>
      </Card>
    )
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
        <ResponsiveContainer width="100%" height={CHART.HEIGHT}>
          <BarChart
            data={chartData}
            margin={{
              top: CHART.MARGIN.TOP,
              right: CHART.MARGIN.RIGHT,
              left: CHART.MARGIN.LEFT,
              bottom: CHART.MARGIN.BOTTOM,
            }}
          >
            <CartesianGrid
              strokeDasharray={CHART.GRID.STROKE_DASHARRAY}
              stroke="hsl(var(--border))"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              stroke="hsl(var(--muted-foreground))"
              fontSize={CHART.AXIS.FONT_SIZE}
              tickLine={false}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              angle={CHART.AXIS.X_LABEL_ANGLE}
              textAnchor="end"
              height={CHART.AXIS.X_LABEL_HEIGHT}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={CHART.AXIS.FONT_SIZE}
              tickLine={false}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              domain={[CHART.AXIS.Y_DOMAIN_MIN, CHART.AXIS.Y_DOMAIN_MAX]}
              tickFormatter={value => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: `${CHART.TOOLTIP.BORDER_RADIUS}px`,
                color: 'hsl(var(--foreground))',
              }}
              formatter={(value: number) => [
                `${value.toFixed(UI.DECIMAL_PLACES.WIN_RATE)}%`,
                'Win Rate',
              ]}
              labelFormatter={label => {
                const player = chartData.find(d => d.name === label)
                return player?.fullName || label
              }}
            />
            <Bar dataKey="winRate" radius={CHART.BAR.CORNER_RADIUS}>
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(index)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default WinRateChart
