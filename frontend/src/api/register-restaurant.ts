import { bilApi } from '@/lib/bil-api'

export interface RegisterRestaurantBody {
  restaurantName: string
  managerName: string
  email: string
  phone: string
}

export async function registerRestaurant({
  email,
  managerName,
  phone,
  restaurantName,
}: RegisterRestaurantBody) {
  await bilApi.post('/restaurants', { email, managerName, phone, restaurantName })
}
