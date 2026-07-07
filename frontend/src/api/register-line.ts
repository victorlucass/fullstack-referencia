import { bilApi } from '@/lib/bil-api'

export interface RegisterLineBody {
  lineName: string
  managerName: string
  email: string
  phone: string
}

export async function registerLine({
  email,
  managerName,
  phone,
  lineName,
}: RegisterLineBody) {
  await bilApi.post('/lines', { email, managerName, phone, lineName })
}
