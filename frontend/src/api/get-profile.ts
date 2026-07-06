import { bilApi } from '@/lib/bil-api'

export interface GetProfileResponse {
  id: string
  name: string
  email: string
  phone: string | null
  role: 'manager' | 'customer'
  createdAt: Date | null
  updatedAt: Date | null
}

export async function getProfile() {
  const response = await bilApi.get<GetProfileResponse>('/me')

  return response.data
}
