import { bilApi } from '@/lib/bil-api'

export interface GetManagedRestaurantResponse {
  id: string
  name: string
  createdAt: Date | null
  updatedAt: Date | null
  description: string | null
  managerId: string | null
}

export async function getManagedRestaurant() {
  const response = await bilApi.get<GetManagedRestaurantResponse>(
    '/managed-restaurant',
  )

  return response.data
}
