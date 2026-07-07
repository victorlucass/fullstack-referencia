import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { getDowntimeEvents } from '@/api/get-downtime-events'
import { Pagination } from '@/components/pagination'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { DowntimeTableFilters } from './downtime-table-filters'
import { DowntimeTableRow } from './downtime-table-row'
import { DowntimeTableSkeleton } from './downtime-table-skeleton'

export function DowntimeHistory() {
  const [searchParams, setSearchParams] = useSearchParams()

  const machine = searchParams.get('machine')
  const cause = searchParams.get('cause')
  const status = searchParams.get('status')

  const pageIndex = z.coerce
    .number()
    .transform((page) => page - 1)
    .parse(searchParams.get('page') ?? '1')

  const { data: result, isLoading: isLoadingEvents } = useQuery({
    queryKey: ['downtime-events', pageIndex, machine, cause, status],
    queryFn: () =>
      getDowntimeEvents({
        pageIndex,
        machine,
        cause,
        status,
      }),
  })

  function handlePaginate(pageIndex: number) {
    setSearchParams((state) => {
      state.set('page', (pageIndex + 1).toString())

      return state
    })
  }

  return (
    <>
      <Helmet title="Histórico de Paradas" />

      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Histórico de Paradas
        </h1>
        <div className="space-y-2.5">
          <DowntimeTableFilters />

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[64px]"></TableHead>
                  <TableHead className="w-[120px]">Identificador</TableHead>
                  <TableHead className="w-[140px]">Máquina</TableHead>
                  <TableHead>Causa</TableHead>
                  <TableHead className="w-[180px]">Início</TableHead>
                  <TableHead className="w-[110px]">Duração</TableHead>
                  <TableHead className="w-[140px]">Status</TableHead>
                  <TableHead className="w-[140px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result &&
                  result.events.map((event) => {
                    return (
                      <DowntimeTableRow key={event.eventId} event={event} />
                    )
                  })}
              </TableBody>
            </Table>
          </div>
          {isLoadingEvents && <DowntimeTableSkeleton />}

          {result && (
            <Pagination
              onPageChange={handlePaginate}
              pageIndex={result.meta.pageIndex}
              totalCount={result.meta.totalCount}
              perPage={result.meta.perPage}
            />
          )}
        </div>
      </div>
    </>
  )
}
