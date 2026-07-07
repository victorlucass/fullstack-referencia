import { expect, test } from '@playwright/test'

test('display the 5 OEE KPIs', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' })

  await expect(page.getByText('84,7%', { exact: true }).first()).toBeVisible()
  await expect(page.getByText('92,1%', { exact: true }).first()).toBeVisible()
  await expect(page.getByText('91,8%', { exact: true }).first()).toBeVisible()
  await expect(page.getByText('98,3%', { exact: true }).first()).toBeVisible()
  await expect(page.getByText('24.587', { exact: true })).toBeVisible()

  await expect(page.getByText('Meta: 85%')).toBeVisible()
})

test('display equipment OEE in process order', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' })

  const machineLabels = page
    .getByTestId('equipment-oee-chart')
    .locator('.recharts-cartesian-axis-tick-value')

  await expect(machineLabels).toHaveText([
    'Printer',
    'SPI',
    'Placement',
    'AOI Pré',
    'Reflow',
    'AOI Pós',
    'Router',
  ])
})

test('display the downtime pareto ordered from highest to lowest', async ({
  page,
}) => {
  await page.goto('/', { waitUntil: 'networkidle' })

  const causes = page.getByText(
    /Falta de Material|Ajuste de Máquina|Limpeza|Setup|Outros/,
  )

  await expect(causes.nth(0)).toHaveText('Falta de Material')
  await expect(causes.nth(1)).toHaveText('Ajuste de Máquina')
  await expect(causes.nth(2)).toHaveText('Limpeza')
  await expect(causes.nth(3)).toHaveText('Setup')
  await expect(causes.nth(4)).toHaveText('Outros')
})

test('display the OEE trend with a goal line', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' })

  await expect(page.getByText('Tendência de OEE (24h)')).toBeVisible()
  await expect(page.getByText('meta 85%')).toBeVisible()
})

test('display the OEE composition and formula', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' })

  await expect(page.getByText('Composição do OEE')).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Disponibilidade' }),
  ).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Performance' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Qualidade' })).toBeVisible()
  await expect(
    page.getByText('OEE = Disponibilidade × Performance × Qualidade ='),
  ).toBeVisible()
})
