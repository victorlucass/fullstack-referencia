export type DowntimeStatus = 'open' | 'resolved'

interface DowntimeStatusProps {
  status: DowntimeStatus
}

const downtimeStatusMap: Record<DowntimeStatus, string> = {
  open: 'Aberta',
  resolved: 'Resolvida',
}

export function DowntimeStatus({ status }: DowntimeStatusProps) {
  return (
    <div className="flex items-center gap-2">
      {status === 'open' && (
        <span
          data-testid="badge"
          className="h-2 w-2 rounded-full bg-amber-500"
        />
      )}

      {status === 'resolved' && (
        <span
          data-testid="badge"
          className="h-2 w-2 rounded-full bg-emerald-500"
        />
      )}

      <span className="font-medium text-muted-foreground">
        {downtimeStatusMap[status]}
      </span>
    </div>
  )
}
