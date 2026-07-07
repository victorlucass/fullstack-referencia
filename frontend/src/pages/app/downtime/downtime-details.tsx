import { useQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { getDowntimeEventDetails } from '@/api/get-downtime-event-details'
import { DowntimeStatus } from '@/components/downtime-status'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'

import { DowntimeDetailsSkeleton } from './downtime-details-skeleton'

export interface DowntimeDetailsProps {
  eventId: string
  open: boolean
}

export function DowntimeDetails({ eventId, open }: DowntimeDetailsProps) {
  const { data: event } = useQuery({
    queryKey: ['downtime-event', eventId],
    queryFn: () => getDowntimeEventDetails({ eventId }),
    enabled: open,
  })

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Parada: {eventId}</DialogTitle>
        <DialogDescription>Detalhes da parada de máquina</DialogDescription>
      </DialogHeader>

      {event ? (
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="text-muted-foreground">Status</TableCell>
              <TableCell className="flex justify-end">
                <DowntimeStatus status={event.status} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">Linha</TableCell>
              <TableCell className="flex justify-end">{event.line}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">Máquina</TableCell>
              <TableCell className="flex justify-end">
                {event.machine}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">Causa</TableCell>
              <TableCell className="flex justify-end">
                {event.cause}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">Início</TableCell>
              <TableCell className="flex justify-end">
                {formatDistanceToNow(event.startedAt, {
                  locale: ptBR,
                  addSuffix: true,
                })}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">
                Duração
              </TableCell>
              <TableCell className="flex justify-end">
                {event.durationMinutes} min
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">
                Observação
              </TableCell>
              <TableCell className="flex justify-end">
                {event.operatorNote ?? 'Sem observação'}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      ) : (
        <DowntimeDetailsSkeleton />
      )}
    </DialogContent>
  )
}
