import { http, HttpResponse } from 'msw'

import { GetOeeTrendResponse } from '../get-oee-trend'

export const getOeeTrendMock = http.get<never, never, GetOeeTrendResponse>(
  '/metrics/oee-trend',
  () => {
    const hours = Array.from({ length: 24 }).map((_, i) => {
      const time = `${String(i).padStart(2, '0')}:00`
      const oee = 80 + Math.round(Math.sin(i / 3) * 6 + (i % 4))

      return { time, oee }
    })

    return HttpResponse.json(hours)
  },
)
