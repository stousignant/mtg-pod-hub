import { useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { TrendingUp } from 'lucide-react'
import PodFilter from './PodFilter'
import type { GameHistoryEntry } from '@/data/mockData'
import { CHART, UI, OUTCOME } from '@/constants/config'

const ALL_PODS_VALUE = '__all__'

interface WinRateTrendChartProps {
  data: GameHistoryEntry[]
  isLoading: boolean
  pods: string[]
  selectedPod: string
  onPodChange: (pod: string) => void
  podsLoading: boolean
}

const WinRateTrendChart = ({
  data,
  isLoading,
  pods,
  selectedPod,
  onPodChange,
  podsLoading,
}: WinRateTrendChartProps) => {
  const filteredData = useMemo(() => {
    if (selectedPod === ALL_PODS_VALUE) return data
    return data.filter(entry => entry.pod_name === selectedPod)
  }, [data, selectedPod])

  const { chartData, playerNames, yDomain } = useMemo(() => {
    const playerGames = new Map<string, GameHistoryEntry[]>()

    for (const entry of filteredData) {
      const games = playerGames.get(entry.player_name) || []
      games.push(entry)
      playerGames.set(entry.player_name, games)
    }

    const allPlayerNames: string[] = []
    const playerSeries = new Map<
      string,
      { gameNumber: number; winRate: number }[]
    >()

    for (const [playerName, games] of playerGames) {
      allPlayerNames.push(playerName)
      const sorted = [...games].sort(
        (a, b) =>
          new Date(a.played_at).getTime() - new Date(b.played_at).getTime()
      )

      let totalWins = 0
      const series: { gameNumber: number; winRate: number }[] = []

      sorted.forEach((game, index) => {
        if (game.outcome === OUTCOME.WIN) {
          totalWins++
        }
        const gameNumber = index + 1
        const winRate = parseFloat(
          ((totalWins / gameNumber) * 100).toFixed(UI.DECIMAL_PLACES.WIN_RATE)
        )
        series.push({ gameNumber, winRate })
      })

      playerSeries.set(playerName, series)
    }

    allPlayerNames.sort()

    const maxGames = Math.max(
      ...Array.from(playerSeries.values()).map(s => s.length),
      0
    )

    const merged: Record<string, number | undefined>[] = []
    for (let i = 0; i < maxGames; i++) {
      const point: Record<string, number | undefined> = { gameNumber: i + 1 }
      for (const name of allPlayerNames) {
        const series = playerSeries.get(name)
        if (series && i < series.length) {
          point[name] = series[i].winRate
        }
      }
      merged.push(point)
    }

    const allValues = Array.from(playerSeries.values()).flatMap(s =>
      s.map(p => p.winRate)
    )
    const dataMin =
      allValues.length > 0 ? Math.min(...allValues) : CHART.AXIS.Y_DOMAIN_MIN
    const dataMax =
      allValues.length > 0 ? Math.max(...allValues) : CHART.AXIS.Y_DOMAIN_MAX
    const yMin = Math.max(
      CHART.AXIS.Y_DOMAIN_MIN,
      Math.floor(dataMin - CHART.AXIS.Y_AUTO_PADDING)
    )
    const yMax = Math.min(
      CHART.AXIS.Y_DOMAIN_MAX,
      Math.ceil(dataMax + CHART.AXIS.Y_AUTO_PADDING)
    )

    return {
      chartData: merged,
      playerNames: allPlayerNames,
      yDomain: [yMin, yMax] as [number, number],
    }
  }, [filteredData])

  if (isLoading) {
    return (
      <Card className="glow-purple">
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
    <Card className="glow-purple border-purple-500/30">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-purple-400" />
          Win Rate Over Time
        </CardTitle>
        <PodFilter
          pods={[ALL_PODS_VALUE, ...pods]}
          selectedPod={selectedPod}
          onPodChange={onPodChange}
          isLoading={podsLoading}
          allPodsValue={ALL_PODS_VALUE}
        />
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={CHART.HEIGHT_WITH_LEGEND}>
          <LineChart
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
              dataKey="gameNumber"
              stroke="hsl(var(--muted-foreground))"
              fontSize={CHART.AXIS.FONT_SIZE}
              tickLine={false}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              label={{
                value: 'Game #',
                position: 'insideBottom',
                offset: -10,
                style: {
                  fill: 'hsl(var(--muted-foreground))',
                  fontSize: CHART.AXIS.FONT_SIZE,
                },
              }}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={CHART.AXIS.FONT_SIZE}
              tickLine={false}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              domain={yDomain}
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
              ]}
              labelFormatter={label => `Game #${label}`}
            />
            <Legend
              verticalAlign="top"
              align="center"
              wrapperStyle={{ paddingBottom: 16 }}
            />
            {playerNames.map((name, index) => (
              <Line
                key={name}
                type="monotone"
                dataKey={name}
                stroke={CHART.PLAYER_COLORS[index % CHART.PLAYER_COLORS.length]}
                strokeWidth={CHART.LINE.STROKE_WIDTH}
                dot={{ r: CHART.LINE.DOT_RADIUS }}
                activeDot={{ r: CHART.LINE.ACTIVE_DOT_RADIUS }}
                connectNulls={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default WinRateTrendChart
