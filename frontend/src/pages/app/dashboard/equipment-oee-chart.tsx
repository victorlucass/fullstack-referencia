import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import {
  Bar,
  BarChart,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'
import colors from 'tailwindcss/colors'

import { DashboardFilters } from '@/api/dashboard-filters'
import { getEquipmentOee } from '@/api/get-equipment-oee'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface EquipmentOeeChartProps {
  filters: DashboardFilters
}

export function EquipmentOeeChart({ filters }: EquipmentOeeChartProps) {
  const { data } = useQuery({
    queryKey: ['metrics', 'equipment-oee', filters],
    queryFn: () => getEquipmentOee(filters),
  })

  return (
    <Card className="col-span-3" data-testid="equipment-oee-chart">
      <CardHeader className="flex-row items-center justify-between pb-4">
        <CardTitle className="text-base font-medium">
          OEE por Equipamento
        </CardTitle>
        <span className="text-xs text-muted-foreground">turno atual</span>
      </CardHeader>
      <CardContent>
        {data ? (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data} style={{ fontSize: 12 }}>
              <XAxis
                dataKey="machine"
                axisLine={false}
                tickLine={false}
                interval={0}
                tick={{ fontSize: 11 }}
                dy={8}
              />
              <YAxis hide domain={[0, 100]} />
              <Bar dataKey="oee" fill={colors.blue[800]} radius={[4, 4, 0, 0]}>
                <LabelList
                  dataKey="oee"
                  position="top"
                  className="fill-muted-foreground text-xs"
                  formatter={(value: number) => `${value}%`}
                />
              </Bar>
            </BarChart>
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
