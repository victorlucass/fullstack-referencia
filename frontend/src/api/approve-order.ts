import { bilApi } from '@/lib/bil-api'

export interface ApproveOrderParams {
  orderId: string
}

export async function approveOrder({ orderId }: ApproveOrderParams) {
  await bilApi.patch(`/orders/${orderId}/approve`)
}
