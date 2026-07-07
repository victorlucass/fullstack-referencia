import { createServer, Response } from 'miragejs'

import type { GetDowntimeEventDetailsResponse } from '../get-downtime-event-details'
import type { GetDowntimeEventsResponse } from '../get-downtime-events'

type DowntimeEventStatus = GetDowntimeEventDetailsResponse['status']

interface DowntimeEventRecord {
  id: string
  line: string
  machine: string
  cause: string
  startedAt: string
  durationMinutes: number
  status: DowntimeEventStatus
  operatorNote: string | null
}

const machines = [
  'Printer',
  'SPI',
  'Placement',
  'AOI Pré',
  'Reflow',
  'AOI Pós',
  'Router',
]

const causes = [
  'Falta de Material',
  'Ajuste de Máquina',
  'Limpeza',
  'Setup',
  'Outros',
]

function seedDowntimeEvents(length: number): DowntimeEventRecord[] {
  return Array.from({ length }).map((_, i) => ({
    id: `downtime-${i + 1}`,
    line: 'SMT 01',
    machine: machines[i % machines.length],
    cause: causes[i % causes.length],
    startedAt: new Date().toISOString(),
    durationMinutes: 10 + (i % 6) * 5,
    status: i % 3 === 0 ? 'open' : 'resolved',
    operatorNote:
      i % 3 === 0 ? 'Aguardando técnico de manutenção.' : 'Resolvido em campo.',
  }))
}

function toDowntimeEventListItem(
  event: DowntimeEventRecord,
): GetDowntimeEventsResponse['events'][number] {
  return {
    eventId: event.id,
    line: event.line,
    machine: event.machine,
    cause: event.cause,
    startedAt: event.startedAt,
    durationMinutes: event.durationMinutes,
    status: event.status,
  }
}

function toDowntimeEventDetails(
  event: DowntimeEventRecord,
): GetDowntimeEventDetailsResponse {
  return {
    id: event.id,
    line: event.line,
    machine: event.machine,
    cause: event.cause,
    startedAt: event.startedAt,
    durationMinutes: event.durationMinutes,
    status: event.status,
    operatorNote: event.operatorNote,
  }
}

interface MockServerConfig {
  environment?: string
  urlPrefix: string
}

export function makeMockServer({
  environment = 'development',
  urlPrefix,
}: MockServerConfig) {
  return createServer({
    environment,
    logging: false,

    seeds(server) {
      server.db.loadData({
        downtimeEvents: seedDowntimeEvents(60),
      })
    },

    routes() {
      this.namespace = ''
      this.urlPrefix = urlPrefix
      this.timing = 0

      this.post('/authenticate', () => new Response(204))
      this.post('/sign-out', () => new Response(204))
      this.post('/lines', () => new Response(201))

      this.get('/me', () => ({
        id: 'user-1',
        name: 'John Doe',
        email: 'johndoe@example.com',
        phone: '11999999999',
        role: 'manager',
        createdAt: new Date().toISOString(),
        updatedAt: null,
      }))

      this.get('/managed-line', () => ({
        id: 'line-1',
        name: 'SMT 01',
        plant: 'Jabil Manaus',
        description: 'Linha de montagem SMT — placas de controle industrial.',
        createdAt: new Date().toISOString(),
        updatedAt: null,
        managerId: 'user-1',
      }))

      this.get('/lines', () => ({
        lines: [
          { id: 'line-1', name: 'SMT 01' },
          { id: 'line-2', name: 'SMT 02' },
          { id: 'line-3', name: 'SMT 03' },
        ],
      }))

      this.put('/profile', () => new Response(204))

      this.get('/metrics/oee-overview', () => ({
        oee: 84.7,
        availability: 92.1,
        performance: 91.8,
        quality: 98.3,
        production: 24587,
        goals: {
          oee: 85,
          availability: 90,
          performance: 92,
          quality: 98,
          production: 26000,
        },
        updatedAt: new Date().toISOString(),
      }))

      this.get('/metrics/equipment-oee', () => [
        { machine: 'Printer', oee: 91 },
        { machine: 'SPI', oee: 89 },
        { machine: 'Placement', oee: 85 },
        { machine: 'AOI Pré', oee: 86 },
        { machine: 'Reflow', oee: 82 },
        { machine: 'AOI Pós', oee: 87 },
        { machine: 'Router', oee: 88 },
      ])

      this.get('/metrics/downtime-pareto', () => [
        { cause: 'Falta de Material', minutes: 120 },
        { cause: 'Ajuste de Máquina', minutes: 85 },
        { cause: 'Limpeza', minutes: 60 },
        { cause: 'Setup', minutes: 45 },
        { cause: 'Outros', minutes: 30 },
      ])

      this.get('/metrics/oee-trend', () =>
        Array.from({ length: 24 }).map((_, i) => ({
          time: `${String(i).padStart(2, '0')}:00`,
          oee: 80 + Math.round(Math.sin(i / 3) * 6 + (i % 4)),
        })),
      )

      this.get('/downtime-events', (schema, request) => {
        const { pageIndex, machine, cause, status } =
          request.queryParams as Record<string, string | undefined>

        const parsedPageIndex = pageIndex ? Number(pageIndex) : 0

        let events = schema.db.downtimeEvents as DowntimeEventRecord[]

        if (machine) {
          events = events.filter((event) => event.machine === machine)
        }

        if (cause) {
          events = events.filter((event) => event.cause.includes(cause))
        }

        if (status) {
          events = events.filter((event) => event.status === status)
        }

        const paginatedEvents = events.slice(
          parsedPageIndex * 10,
          (parsedPageIndex + 1) * 10,
        )

        const response: GetDowntimeEventsResponse = {
          events: paginatedEvents.map(toDowntimeEventListItem),
          meta: {
            pageIndex: parsedPageIndex,
            perPage: 10,
            totalCount: events.length,
          },
        }

        return response
      })

      this.get('/downtime-events/:eventId', (schema, request) => {
        const event = schema.db.downtimeEvents.findBy({
          id: request.params.eventId,
        }) as DowntimeEventRecord | null

        if (!event) {
          return new Response(404)
        }

        return toDowntimeEventDetails(event)
      })

      this.patch('/downtime-events/:eventId/resolve', (schema, request) => {
        const event = schema.db.downtimeEvents.findBy({
          id: request.params.eventId,
        })

        if (!event) {
          return new Response(404)
        }

        schema.db.downtimeEvents.update(event.id, { status: 'resolved' })

        return new Response(204)
      })

      this.passthrough()
    },
  })
}
