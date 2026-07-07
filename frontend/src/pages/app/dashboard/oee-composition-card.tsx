import { GetOeeOverviewResponse } from '@/api/get-oee-overview'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface OeeCompositionCardProps {
  overview?: GetOeeOverviewResponse
}

const factors = [
  { key: 'availability', label: 'Disponibilidade' },
  { key: 'performance', label: 'Performance' },
  { key: 'quality', label: 'Qualidade' },
] as const

export function OeeCompositionCard({ overview }: OeeCompositionCardProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between pb-4">
        <CardTitle className="text-base font-medium">
          Composição do OEE
        </CardTitle>
        <span className="text-xs text-muted-foreground">
          Disponibilidade × Performance × Qualidade
        </span>
      </CardHeader>
      <CardContent className="space-y-4">
        {overview ? (
          <>
            <div className="space-y-3">
              {factors.map(({ key, label }) => (
                <div key={key} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">{label}</span>
                    <span className="text-muted-foreground">
                      {overview[key].toLocaleString('pt-BR', {
                        maximumFractionDigits: 1,
                      })}
                      %
                    </span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-muted">
                    <div
                      className="h-2.5 rounded-full bg-primary"
                      style={{ width: `${overview[key]}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="border-t pt-3 text-center text-xs text-muted-foreground">
              OEE = Disponibilidade × Performance × Qualidade ={' '}
              <span className="font-semibold text-foreground">
                {overview.oee.toLocaleString('pt-BR', {
                  maximumFractionDigits: 1,
                })}
                %
              </span>
            </p>
          </>
        ) : (
          <div className="h-[140px] w-full animate-pulse rounded-md bg-muted" />
        )}
      </CardContent>
    </Card>
  )
}
