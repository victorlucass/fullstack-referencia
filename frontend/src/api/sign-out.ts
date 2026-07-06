import { bilApi } from '@/lib/bil-api'

export async function signOut() {
  await bilApi.post('/sign-out')
}
