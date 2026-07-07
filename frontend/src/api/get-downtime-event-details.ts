import { bilApi } from '@/lib/bil-api'

export interface GetDowntimeEventDetailsParams {
  eventId: string
}

export interface GetDowntimeEventDetailsResponse {
  id: string
  line: string
  machine: string
  cause: string
  startedAt: string
  durationMinutes: number
  status: 'open' | 'resolved'
  operatorNote: string | null
}

export async function getDowntimeEventDetails({
  eventId,
}: GetDowntimeEventDetailsParams) {
  const response = await bilApi.get<GetDowntimeEventDetailsResponse>(
    `/downtime-events/${eventId}`,
  )

  return response.data
}
