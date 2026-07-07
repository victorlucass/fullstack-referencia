import { http, HttpResponse } from 'msw'

export const resolveDowntimeEventMock = http.patch(
  '/downtime-events/:eventId/resolve',
  () => {
    return new HttpResponse(null, { status: 204 })
  },
)
