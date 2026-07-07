export type DashboardPeriod = 'today' | 'last-7-days' | 'month'

export interface DashboardFilters {
  line: string
  period: DashboardPeriod
}
