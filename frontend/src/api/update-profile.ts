import { bilApi } from '@/lib/bil-api'

export interface UpdateProfileBody {
  name: string
  description: string | null
}

export async function updateProfile({ description, name }: UpdateProfileBody) {
  await bilApi.put('/profile', { name, description })
}
