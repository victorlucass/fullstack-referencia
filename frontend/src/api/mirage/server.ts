import { createServer, Response } from 'miragejs'

import type { GetOrderDetailsResponse } from '../get-order-details'
import type { GetOrdersResponse } from '../get-orders'

type OrderStatus = GetOrderDetailsResponse['status']

interface OrderRecord {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  createdAt: string
  status: OrderStatus
  items: {
    id: string
    priceInCents: number
    quantity: number
    productName: string
  }[]
}

const orderStatuses: OrderStatus[] = [
  'pending',
  'processing',
  'canceled',
  'delivered',
  'delivering',
]

function seedOrders(length: number): OrderRecord[] {
  return Array.from({ length }).map((_, i) => ({
    id: `order-${i + 1}`,
    customerName: `Customer ${i + 1}`,
    customerEmail: `customer${i + 1}@example.com`,
    customerPhone: '11999999999',
    createdAt: new Date().toISOString(),
    status: orderStatuses[i % orderStatuses.length],
    items: [
      {
        id: `order-${i + 1}-item-1`,
        priceInCents: 1000,
        quantity: 1,
        productName: 'Product A',
      },
      {
        id: `order-${i + 1}-item-2`,
        priceInCents: 2000,
        quantity: 2,
        productName: 'Product B',
      },
    ],
  }))
}

function orderTotalInCents(order: OrderRecord) {
  return order.items.reduce(
    (total, item) => total + item.priceInCents * item.quantity,
    0,
  )
}

function toOrderListItem(
  order: OrderRecord,
): GetOrdersResponse['orders'][number] {
  return {
    orderId: order.id,
    createdAt: order.createdAt,
    status: order.status,
    customerName: order.customerName,
    total: orderTotalInCents(order),
  }
}

function toOrderDetails(order: OrderRecord): GetOrderDetailsResponse {
  return {
    id: order.id,
    createdAt: order.createdAt,
    status: order.status,
    totalInCents: orderTotalInCents(order),
    customer: {
      name: order.customerName,
      email: order.customerEmail,
      phone: order.customerPhone,
    },
    orderItems: order.items.map((item) => ({
      id: item.id,
      priceInCents: item.priceInCents,
      quantity: item.quantity,
      product: { name: item.productName },
    })),
  }
}

interface MockServerConfig {
  environment?: string
  urlPrefix: string
}

export function makeMockServer({ environment = 'development', urlPrefix }: MockServerConfig) {
  return createServer({
    environment,
    logging: false,

    seeds(server) {
      server.db.loadData({
        orders: seedOrders(60),
      })
    },

    routes() {
      this.namespace = ''
      this.urlPrefix = urlPrefix
      this.timing = 0

      this.post('/authenticate', () => new Response(204))
      this.post('/sign-out', () => new Response(204))
      this.post('/restaurants', () => new Response(201))

      this.get('/me', () => ({
        id: 'user-1',
        name: 'John Doe',
        email: 'johndoe@example.com',
        phone: '11999999999',
        role: 'manager',
        createdAt: new Date().toISOString(),
        updatedAt: null,
      }))

      this.get('/managed-restaurant', () => ({
        id: 'restaurant-1',
        name: 'Restaurant demo',
        description: 'Descrição de demonstração',
        createdAt: new Date().toISOString(),
        updatedAt: null,
        managerId: 'user-1',
      }))

      this.put('/profile', () => new Response(204))

      this.get('/metrics/day-orders-amount', () => ({
        amount: 20,
        diffFromYesterday: -5,
      }))

      this.get('/metrics/month-orders-amount', () => ({
        amount: 200,
        diffFromLastMonth: 7,
      }))

      this.get('/metrics/month-canceled-orders-amount', () => ({
        amount: 5,
        diffFromLastMonth: -5,
      }))

      this.get('/metrics/month-receipt', () => ({
        receipt: 20000,
        diffFromLastMonth: 10,
      }))

      this.get('/metrics/daily-receipt-in-period', () => [
        { date: '01/01/2024', receipt: 2000 },
        { date: '02/01/2024', receipt: 800 },
        { date: '03/01/2024', receipt: 8000 },
        { date: '04/01/2024', receipt: 540 },
        { date: '05/01/2024', receipt: 400 },
        { date: '06/01/2024', receipt: 700 },
        { date: '07/01/2024', receipt: 1000 },
      ])

      this.get('/metrics/popular-products', () => [
        { product: 'Product A', amount: 40 },
        { product: 'Product B', amount: 30 },
        { product: 'Product C', amount: 22 },
        { product: 'Product D', amount: 12 },
        { product: 'Product E', amount: 8 },
      ])

      this.get('/orders', (schema, request) => {
        const { pageIndex, customerName, orderId, status } =
          request.queryParams as Record<string, string | undefined>

        const parsedPageIndex = pageIndex ? Number(pageIndex) : 0

        let orders = schema.db.orders as OrderRecord[]

        if (customerName) {
          orders = orders.filter((order) =>
            order.customerName.includes(customerName),
          )
        }

        if (orderId) {
          orders = orders.filter((order) => order.id.includes(orderId))
        }

        if (status) {
          orders = orders.filter((order) => order.status === status)
        }

        const paginatedOrders = orders.slice(
          parsedPageIndex * 10,
          (parsedPageIndex + 1) * 10,
        )

        const response: GetOrdersResponse = {
          orders: paginatedOrders.map(toOrderListItem),
          meta: {
            pageIndex: parsedPageIndex,
            perPage: 10,
            totalCount: orders.length,
          },
        }

        return response
      })

      this.get('/orders/:orderId', (schema, request) => {
        const order = schema.db.orders.findBy({
          id: request.params.orderId,
        }) as OrderRecord | null

        if (!order) {
          return new Response(404)
        }

        return toOrderDetails(order)
      })

      const transitionOrderStatus = (status: OrderStatus) => {
        return (schema: any, request: any) => {
          const order = schema.db.orders.findBy({ id: request.params.orderId })

          if (!order) {
            return new Response(404)
          }

          schema.db.orders.update(order.id, { status })

          return new Response(204)
        }
      }

      this.patch(
        '/orders/:orderId/approve',
        transitionOrderStatus('processing'),
      )
      this.patch('/orders/:orderId/cancel', transitionOrderStatus('canceled'))
      this.patch(
        '/orders/:orderId/dispatch',
        transitionOrderStatus('delivering'),
      )
      this.patch(
        '/orders/:orderId/deliver',
        transitionOrderStatus('delivered'),
      )

      this.passthrough()
    },
  })
}
