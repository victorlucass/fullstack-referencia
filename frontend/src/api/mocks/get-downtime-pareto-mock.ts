import { http, HttpResponse } from 'msw'

import { GetDowntimeParetoResponse } from '../get-downtime-pareto'

export const getDowntimeParetoMock = http.get<
  never,
  never,
  GetDowntimeParetoResponse
>('/metrics/downtime-pareto', () => {
  return HttpResponse.json([
    { cause: 'Falta de Material', minutes: 120 },
    { cause: 'Ajuste de Máquina', minutes: 85 },
    { cause: 'Limpeza', minutes: 60 },
    { cause: 'Setup', minutes: 45 },
    { cause: 'Outros', minutes: 30 },
  ])
})
