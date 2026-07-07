import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'
import colors from 'tailwindcss/colors'

import { DashboardFilters } from '@/api/dashboard-filters'
import { getOeeTrend } from '@/api/get-oee-trend'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface OeeTrendChartProps {
  filters: DashboardFilters
  goal: number
}

export function OeeTrendChart({ filters, goal }: OeeTrendChartProps) {
  const { data } = useQuery({
    queryKey: ['metrics', 'oee-trend', filters],
    queryFn: () => getOeeTrend(filters),
  })

  return (
    <Card className="col-span-3">
      <CardHeader className="flex-row items-center justify-between pb-4">
        <CardTitle className="text-base font-medium">
          Tendência de OEE (24h)
        </CardTitle>
        <span className="text-xs text-muted-foreground">meta {goal}%</span>
      </CardHeader>
      <CardContent>
        {data ? (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data} style={{ fontSize: 12 }}>
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                dy={8}
                interval={3}
              />
              <YAxis hide domain={[0, 100]} />
              <CartesianGrid vertical={false} className="stroke-muted" />
              <ReferenceLine
                y={goal}
                stroke={colors.amber[500]}
                strokeDasharray="4 4"
              />
              <Line
                type="monotone"
                dataKey="oee"
                stroke={colors.blue[800]}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-[220px] w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
