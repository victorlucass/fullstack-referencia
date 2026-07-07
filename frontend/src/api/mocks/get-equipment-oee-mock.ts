import { http, HttpResponse } from 'msw'

import { GetEquipmentOeeResponse } from '../get-equipment-oee'

export const getEquipmentOeeMock = http.get<
  never,
  never,
  GetEquipmentOeeResponse
>('/metrics/equipment-oee', () => {
  return HttpResponse.json([
    { machine: 'Printer', oee: 91 },
    { machine: 'SPI', oee: 89 },
    { machine: 'Placement', oee: 85 },
    { machine: 'AOI Pré', oee: 86 },
    { machine: 'Reflow', oee: 82 },
    { machine: 'AOI Pós', oee: 87 },
    { machine: 'Router', oee: 88 },
  ])
})
