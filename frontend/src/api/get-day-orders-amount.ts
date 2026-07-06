import { bilApi } from '@/lib/bil-api'

export interface GetDayOrdersAmountResponse {
  amount: number
  diffFromYesterday: number
}

export async function getDayOrdersAmount() {
  const response = await bilApi.get<GetDayOrdersAmountResponse>(
    '/metrics/day-orders-amount',
  )

  return response.data
}
