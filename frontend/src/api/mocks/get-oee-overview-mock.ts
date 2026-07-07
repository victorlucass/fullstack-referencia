import { http, HttpResponse } from 'msw'

import { GetOeeOverviewResponse } from '../get-oee-overview'

export const getOeeOverviewMock = http.get<
  never,
  never,
  GetOeeOverviewResponse
>('/metrics/oee-overview', () => {
  return HttpResponse.json({
    oee: 84.7,
    availability: 92.1,
    performance: 91.8,
    quality: 98.3,
    production: 24587,
    goals: {
      oee: 85,
      availability: 90,
      performance: 92,
      quality: 98,
      production: 26000,
    },
    updatedAt: new Date().toISOString(),
  })
})
