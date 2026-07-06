import { bilApi } from '@/lib/bil-api'

export type GetPopularProductsResponse = {
  product: string
  amount: number
}[]

export async function getPopularProducts() {
  const response = await bilApi.get<GetPopularProductsResponse>(
    '/metrics/popular-products',
  )

  return response.data
}
