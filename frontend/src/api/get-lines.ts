import { bilApi } from '@/lib/bil-api'

export interface GetLinesResponse {
  lines: {
    id: string
    name: string
  }[]
}

export async function getLines() {
  const response = await bilApi.get<GetLinesResponse>('/lines')

  return response.data
}
