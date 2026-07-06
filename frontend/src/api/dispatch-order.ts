import { bilApi } from '@/lib/bil-api'

export interface DispatchOrderParams {
  orderId: string
}

export async function dispatchOrder({ orderId }: DispatchOrderParams) {
  await bilApi.patch(`/orders/${orderId}/dispatch`)
}
