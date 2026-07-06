import { env } from '@/env'

export async function enableMockServer() {
  if (env.MODE === 'test' || !env.VITE_ENABLE_MOCK_API) {
    return
  }

  const { makeMockServer } = await import('./server')

  makeMockServer({ environment: env.MODE, urlPrefix: env.VITE_API_URL })
}
