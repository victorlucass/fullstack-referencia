import { bilApi } from '@/lib/bil-api'

export interface GetDowntimeEventsQuery {
  pageIndex?: number | null
  machine?: string | null
  cause?: string | null
  status?: string | null
}

export interface GetDowntimeEventsResponse {
  events: {
    eventId: string
    line: string
    machine: string
    cause: string
    startedAt: string
    durationMinutes: number
    status: 'open' | 'resolved'
  }[]
  meta: {
    pageIndex: number
    perPage: number
    totalCount: number
  }
}

export async function getDowntimeEvents({
  pageIndex,
  machine,
  cause,
  status,
}: GetDowntimeEventsQuery) {
  const response = await bilApi.get<GetDowntimeEventsResponse>(
    '/downtime-events',
    {
      params: {
        pageIndex,
        machine,
        cause,
        status,
      },
    },
  )

  return response.data
}
