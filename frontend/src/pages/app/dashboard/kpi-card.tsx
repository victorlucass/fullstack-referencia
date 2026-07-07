import { LucideIcon } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { MetricCardSkeleton } from './metric-card-skeleton'

export interface KpiCardProps {
  title: string
  icon: LucideIcon
  value: number | null
  goal: number
  format: 'percent' | 'count'
}

function formatValue(value: number, format: KpiCardProps['format']) {
  if (format === 'percent') {
    return `${value.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`
  }

  return value.toLocaleString('pt-BR')
}

export function KpiCard({
  title,
  icon: Icon,
  value,
  goal,
  format,
}: KpiCardProps) {
  const progress = value !== null ? Math.min((value / goal) * 100, 100) : 0

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-2">
        {value !== null ? (
          <>
            <span className="text-2xl font-bold tracking-tight">
              {formatValue(value, format)}
            </span>
            <div className="h-1.5 w-full rounded-full bg-muted">
              <div
                className="h-1.5 rounded-full bg-primary"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Meta: {formatValue(goal, format)}
            </p>
          </>
        ) : (
          <MetricCardSkeleton />
        )}
      </CardContent>
    </Card>
  )
}
