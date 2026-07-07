import { http, HttpResponse } from 'msw'

import { GetManagedLineResponse } from '../get-managed-line'

export const getManagedLineMock = http.get<
  never,
  never,
  GetManagedLineResponse
>('/managed-line', () => {
  return HttpResponse.json({
    id: 'line-1',
    name: 'SMT 01',
    plant: 'Jabil Manaus',
    description: 'Linha de montagem SMT — placas de controle industrial.',
    managerId: 'user-1',
    createdAt: new Date(),
    updatedAt: null,
  })
})
