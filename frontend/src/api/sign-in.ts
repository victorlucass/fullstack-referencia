import { bilApi } from '@/lib/bil-api'

export interface SignInBody {
  email: string
}

export async function signIn({ email }: SignInBody) {
  await bilApi.post('/authenticate', { email })
}
