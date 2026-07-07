import { expect, test } from '@playwright/test'

test('list downtime events', async ({ page }) => {
  await page.goto('/downtime', { waitUntil: 'networkidle' })

  await expect(
    page.getByRole('cell', { name: 'downtime-1', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByRole('cell', { name: 'downtime-10', exact: true }),
  ).toBeVisible()
})

test('paginate downtime events', async ({ page }) => {
  await page.goto('/downtime', { waitUntil: 'networkidle' })

  await page.getByRole('button', { name: 'Próxima página' }).click()

  await expect(
    page.getByRole('cell', { name: 'downtime-11', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByRole('cell', { name: 'downtime-20', exact: true }),
  ).toBeVisible()

  await page.getByRole('button', { name: 'Última página' }).click()

  await expect(
    page.getByRole('cell', { name: 'downtime-51', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByRole('cell', { name: 'downtime-60', exact: true }),
  ).toBeVisible()

  await page.getByRole('button', { name: 'Página anterior' }).click()

  await expect(
    page.getByRole('cell', { name: 'downtime-41', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByRole('cell', { name: 'downtime-50', exact: true }),
  ).toBeVisible()

  await page.getByRole('button', { name: 'Primeira página' }).click()

  await expect(
    page.getByRole('cell', { name: 'downtime-1', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByRole('cell', { name: 'downtime-10', exact: true }),
  ).toBeVisible()
})

test('filter by cause', async ({ page }) => {
  await page.goto('/downtime', { waitUntil: 'networkidle' })

  await page.getByPlaceholder('Causa da parada').fill('Setup')
  await page.getByRole('button', { name: 'Filtrar resultados' }).click()

  await expect(
    page.getByRole('cell', { name: 'Setup', exact: true }),
  ).toHaveCount(10)
})

test('filter by machine', async ({ page }) => {
  await page.goto('/downtime', { waitUntil: 'networkidle' })

  await page.getByRole('combobox').first().click()
  await page.getByLabel('Printer').click()

  await page.getByRole('button', { name: 'Filtrar resultados' }).click()

  await expect(
    page.getByRole('cell', { name: 'Printer', exact: true }),
  ).toHaveCount(9)
})

test('filter by status', async ({ page }) => {
  await page.goto('/downtime', { waitUntil: 'networkidle' })

  await page.getByRole('combobox').nth(1).click()
  await page.getByLabel('Aberta').click()

  await page.getByRole('button', { name: 'Filtrar resultados' }).click()

  await expect(
    page.getByRole('cell', { name: 'Aberta', exact: true }),
  ).toHaveCount(10)
})
