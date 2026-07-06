import { bilApi } from '@/lib/bil-api'

export interface CancelOrderParams {
  orderId: string
}

export async function cancelOrder({ orderId }: CancelOrderParams) {
  await bilApi.patch(`/orders/${orderId}/cancel`)
}
