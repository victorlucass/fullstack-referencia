import { useQuery } from '@tanstack/react-query'
import { Activity, CheckCircle2, Gauge, Package, Percent } from 'lucide-react'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'

import { DashboardFilters, DashboardPeriod } from '@/api/dashboard-filters'
import { getOeeOverview } from '@/api/get-oee-overview'

import { DashboardHeader } from './dashboard-header'
import { DowntimeParetoChart } from './downtime-pareto-chart'
import { EquipmentOeeChart } from './equipment-oee-chart'
import { KpiCard } from './kpi-card'
import { OeeCompositionCard } from './oee-composition-card'
import { OeeTrendChart } from './oee-trend-chart'

export function Dashboard() {
  const [line, setLine] = useState('line-1')
  const [period, setPeriod] = useState<DashboardPeriod>('today')

  const filters: DashboardFilters = { line, period }

  const { data: overview } = useQuery({
    queryKey: ['metrics', 'oee-overview', filters],
    queryFn: () => getOeeOverview(filters),
  })

  return (
    <>
      <Helmet title="Dashboard" />
      <div className="flex flex-col gap-4">
        <DashboardHeader
          line={line}
          onLineChange={setLine}
          period={period}
          onPeriodChange={setPeriod}
          updatedAt={overview?.updatedAt}
          plant="Jabil Manaus"
        />

        <div className="grid grid-cols-5 gap-4">
          <KpiCard
            title="OEE"
            icon={Gauge}
            value={overview?.oee ?? null}
            goal={overview?.goals.oee ?? 0}
            format="percent"
          />
          <KpiCard
            title="Disponibilidade"
            icon={Activity}
            value={overview?.availability ?? null}
            goal={overview?.goals.availability ?? 0}
            format="percent"
          />
          <KpiCard
            title="Performance"
            icon={Percent}
            value={overview?.performance ?? null}
            goal={overview?.goals.performance ?? 0}
            format="percent"
          />
          <KpiCard
            title="Qualidade (FPY)"
            icon={CheckCircle2}
            value={overview?.quality ?? null}
            goal={overview?.goals.quality ?? 0}
            format="percent"
          />
          <KpiCard
            title="Produção"
            icon={Package}
            value={overview?.production ?? null}
            goal={overview?.goals.production ?? 0}
            format="count"
          />
        </div>

        <div className="grid grid-cols-9 gap-4">
          <EquipmentOeeChart filters={filters} />
          <DowntimeParetoChart filters={filters} />
          <OeeTrendChart filters={filters} goal={overview?.goals.oee ?? 85} />
        </div>

        <OeeCompositionCard overview={overview} />
      </div>
    </>
  )
}
