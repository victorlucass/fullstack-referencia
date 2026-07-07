import { http, HttpResponse } from 'msw'

import { RegisterLineBody } from '../register-line'

export const registerLineMock = http.post<never, RegisterLineBody>(
  '/lines',
  async ({ request }) => {
    const { lineName } = await request.json()

    if (lineName === 'SMT 01') {
      return new HttpResponse(null, { status: 201 })
    }

    return new HttpResponse(null, { status: 400 })
  },
)
