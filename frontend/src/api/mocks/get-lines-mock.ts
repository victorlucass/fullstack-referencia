import { http, HttpResponse } from 'msw'

import { GetLinesResponse } from '../get-lines'

export const getLinesMock = http.get<never, never, GetLinesResponse>(
  '/lines',
  () => {
    return HttpResponse.json({
      lines: [
        { id: 'line-1', name: 'SMT 01' },
        { id: 'line-2', name: 'SMT 02' },
        { id: 'line-3', name: 'SMT 03' },
      ],
    })
  },
)
