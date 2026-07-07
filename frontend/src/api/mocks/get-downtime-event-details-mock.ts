import { http, HttpResponse } from 'msw'

import { GetDowntimeEventDetailsResponse } from '../get-downtime-event-details'

export const getDowntimeEventDetailsMock = http.get<
  { eventId: string },
  never,
  GetDowntimeEventDetailsResponse
>('/downtime-events/:eventId', ({ params }) => {
  return HttpResponse.json({
    id: params.eventId,
    line: 'SMT 01',
    machine: 'Reflow',
    cause: 'Ajuste de Máquina',
    startedAt: new Date().toISOString(),
    durationMinutes: 25,
    status: 'open',
    operatorNote: 'Aguardando técnico de manutenção.',
  })
})
