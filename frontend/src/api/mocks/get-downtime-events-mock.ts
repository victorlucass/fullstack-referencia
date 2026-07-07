import { http, HttpResponse } from 'msw'

import { GetDowntimeEventsResponse } from '../get-downtime-events'

const machines = [
  'Printer',
  'SPI',
  'Placement',
  'AOI Pré',
  'Reflow',
  'AOI Pós',
  'Router',
]

const causes = [
  'Falta de Material',
  'Ajuste de Máquina',
  'Limpeza',
  'Setup',
  'Outros',
]

const events: GetDowntimeEventsResponse['events'] = Array.from({
  length: 60,
}).map((_, i) => ({
  eventId: `downtime-${i + 1}`,
  line: 'SMT 01',
  machine: machines[i % machines.length],
  cause: causes[i % causes.length],
  startedAt: new Date().toISOString(),
  durationMinutes: 10 + (i % 6) * 5,
  status: i % 3 === 0 ? 'open' : 'resolved',
}))

export const getDowntimeEventsMock = http.get<
  never,
  never,
  GetDowntimeEventsResponse
>('/downtime-events', ({ request }) => {
  const url = new URL(request.url)
  const pageIndex = Number(url.searchParams.get('pageIndex') ?? '0')
  const machine = url.searchParams.get('machine')
  const cause = url.searchParams.get('cause')
  const status = url.searchParams.get('status')

  let filtered = events

  if (machine) {
    filtered = filtered.filter((event) => event.machine === machine)
  }

  if (cause) {
    filtered = filtered.filter((event) => event.cause.includes(cause))
  }

  if (status) {
    filtered = filtered.filter((event) => event.status === status)
  }

  const paginated = filtered.slice(pageIndex * 10, (pageIndex + 1) * 10)

  return HttpResponse.json({
    events: paginated,
    meta: {
      pageIndex,
      perPage: 10,
      totalCount: filtered.length,
    },
  })
})
