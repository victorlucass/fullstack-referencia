import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'

import { DashboardFilters } from '@/api/dashboard-filters'
import { getDowntimePareto } from '@/api/get-downtime-pareto'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DowntimeParetoChartProps {
  filters: DashboardFilters
}

export function DowntimeParetoChart({ filters }: DowntimeParetoChartProps) {
  const { data } = useQuery({
    queryKey: ['metrics', 'downtime-pareto', filters],
    queryFn: () => getDowntimePareto(filters),
  })

  const maxMinutes = data ? Math.max(...data.map((item) => item.minutes)) : 0

  return (
    <Card className="col-span-3">
      <CardHeader className="flex-row items-center justify-between pb-4">
        <CardTitle className="text-base font-medium">
          Pareto de Paradas (min)
        </CardTitle>
        <span className="text-xs text-muted-foreground">turno atual</span>
      </CardHeader>
      <CardContent>
        {data ? (
          <div className="flex h-[220px] flex-col justify-between gap-3">
            {data.map((item) => (
              <div key={item.cause} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{item.cause}</span>
                  <span className="text-muted-foreground">{item.minutes}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${(item.minutes / maxMinutes) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-[220px] w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
