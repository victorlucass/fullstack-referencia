import { bilApi } from '@/lib/bil-api'

export interface ResolveDowntimeEventParams {
  eventId: string
}

export async function resolveDowntimeEvent({
  eventId,
}: ResolveDowntimeEventParams) {
  await bilApi.patch(`/downtime-events/${eventId}/resolve`)
}
