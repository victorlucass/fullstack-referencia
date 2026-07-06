import { bilApi } from '@/lib/bil-api'

export interface DeliverOrderParams {
  orderId: string
}

export async function deliverOrder({ orderId }: DeliverOrderParams) {
  await bilApi.patch(`/orders/${orderId}/deliver`)
}
