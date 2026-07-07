import { useMutation, useQueryClient } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Check, Search } from 'lucide-react'
import { useState } from 'react'

import { GetDowntimeEventsResponse } from '@/api/get-downtime-events'
import { resolveDowntimeEvent } from '@/api/resolve-downtime-event'
import { DowntimeStatus } from '@/components/downtime-status'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { TableCell, TableRow } from '@/components/ui/table'

import { DowntimeDetails } from './downtime-details'

interface DowntimeTableRowProps {
  event: GetDowntimeEventsResponse['events'][number]
}

export function DowntimeTableRow({ event }: DowntimeTableRowProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const queryClient = useQueryClient()

  const { mutateAsync: resolveDowntimeEventFn, isPending: isResolving } =
    useMutation({
      mutationFn: resolveDowntimeEvent,
      async onSuccess(_, { eventId }) {
        const eventsListCache =
          queryClient.getQueriesData<GetDowntimeEventsResponse>({
            queryKey: ['downtime-events'],
          })

        eventsListCache.forEach(([cacheKey, cacheData]) => {
          if (!cacheData) {
            return
          }

          queryClient.setQueryData<GetDowntimeEventsResponse>(cacheKey, {
            ...cacheData,
            events: cacheData.events.map((item) => {
              if (item.eventId === eventId) {
                return { ...item, status: 'resolved' }
              }

              return item
            }),
          })
        })
      },
    })

  return (
    <TableRow>
      <TableCell>
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="xs">
              <Search className="h-3 w-3" />
              <span className="sr-only">Detalhes da parada</span>
            </Button>
          </DialogTrigger>

          <DowntimeDetails open={isDetailsOpen} eventId={event.eventId} />
        </Dialog>
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {event.eventId}
      </TableCell>
      <TableCell className="font-medium">{event.machine}</TableCell>
      <TableCell className="font-medium">{event.cause}</TableCell>
      <TableCell className="text-muted-foreground">
        {formatDistanceToNow(event.startedAt, {
          locale: ptBR,
          addSuffix: true,
        })}
      </TableCell>
      <TableCell className="font-mono text-xs">
        {event.durationMinutes} min
      </TableCell>
      <TableCell>
        <DowntimeStatus status={event.status} />
      </TableCell>
      <TableCell>
        {event.status === 'open' && (
          <Button
            variant="outline"
            disabled={isResolving}
            size="xs"
            onClick={() => resolveDowntimeEventFn({ eventId: event.eventId })}
          >
            <Check className="mr-2 h-3 w-3" />
            Resolver
          </Button>
        )}
      </TableCell>
    </TableRow>
  )
}
