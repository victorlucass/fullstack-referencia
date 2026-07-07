import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'

import { DashboardPeriod } from '@/api/dashboard-filters'
import { getLines } from '@/api/get-lines'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface DashboardHeaderProps {
  line: string
  onLineChange: (line: string) => void
  period: DashboardPeriod
  onPeriodChange: (period: DashboardPeriod) => void
  updatedAt?: string
  plant?: string
}

export function DashboardHeader({
  line,
  onLineChange,
  period,
  onPeriodChange,
  updatedAt,
  plant,
}: DashboardHeaderProps) {
  const { data } = useQuery({
    queryKey: ['lines'],
    queryFn: getLines,
    staleTime: Infinity,
  })

  const lineName = data?.lines.find((item) => item.id === line)?.name

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Visão Operacional — OEE
        </h1>
        <p className="text-sm text-muted-foreground">
          {lineName ?? 'Linha SMT'}
          {plant ? ` · ${plant}` : ''}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Select value={line} onValueChange={onLineChange}>
          <SelectTrigger className="h-9 w-[140px]">
            <SelectValue placeholder="Linha" />
          </SelectTrigger>
          <SelectContent>
            {data?.lines.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={period}
          onValueChange={(value) => onPeriodChange(value as DashboardPeriod)}
        >
          <SelectTrigger className="h-9 w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Hoje</SelectItem>
            <SelectItem value="last-7-days">Últimos 7 dias</SelectItem>
            <SelectItem value="month">Mês atual</SelectItem>
          </SelectContent>
        </Select>

        {updatedAt && (
          <span className="whitespace-nowrap text-sm text-muted-foreground">
            Atualizado às {format(new Date(updatedAt), 'HH:mm')}
          </span>
        )}
      </div>
    </div>
  )
}
