import { setupWorker } from 'msw/browser'

import { env } from '@/env'

import { getDowntimeEventDetailsMock } from './get-downtime-event-details-mock'
import { getDowntimeEventsMock } from './get-downtime-events-mock'
import { getDowntimeParetoMock } from './get-downtime-pareto-mock'
import { getEquipmentOeeMock } from './get-equipment-oee-mock'
import { getLinesMock } from './get-lines-mock'
import { getManagedLineMock } from './get-managed-line-mock'
import { getOeeOverviewMock } from './get-oee-overview-mock'
import { getOeeTrendMock } from './get-oee-trend-mock'
import { getProfileMock } from './get-profile-mock'
import { registerLineMock } from './register-line-mock'
import { resolveDowntimeEventMock } from './resolve-downtime-event-mock'
import { signInMock } from './sign-in-mock'
import { updateProfileMock } from './update-profile-mock'

export const worker = setupWorker(
  signInMock,
  registerLineMock,
  getProfileMock,
  getManagedLineMock,
  getLinesMock,
  updateProfileMock,
  getOeeOverviewMock,
  getEquipmentOeeMock,
  getDowntimeParetoMock,
  getOeeTrendMock,
  getDowntimeEventsMock,
  getDowntimeEventDetailsMock,
  resolveDowntimeEventMock,
)

export async function enableMSW() {
  if (env.MODE !== 'test') {
    return
  }

  await worker.start()
}
