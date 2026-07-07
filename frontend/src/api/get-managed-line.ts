import { bilApi } from '@/lib/bil-api'

export interface GetManagedLineResponse {
  id: string
  name: string
  plant: string
  createdAt: Date | null
  updatedAt: Date | null
  description: string | null
  managerId: string | null
}

export async function getManagedLine() {
  const response = await bilApi.get<GetManagedLineResponse>('/managed-line')

  return response.data
}
