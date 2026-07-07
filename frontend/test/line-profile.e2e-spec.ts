import { expect, test } from '@playwright/test'

test('update line profile successfully', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' })

  await page.getByRole('button', { name: 'SMT 01' }).click()
  await page.getByRole('menuitem', { name: 'Configurações da linha' }).click()

  await page.getByLabel('Nome').fill('SMT 01B')
  await page.getByLabel('Descrição').fill('Another Description')

  await page.getByRole('button', { name: 'Salvar' }).click()

  await page.waitForLoadState('networkidle')

  const toast = page.getByText(
    'Configurações da linha atualizadas com sucesso!',
  )

  await expect(toast).toBeVisible()

  await page.getByRole('button', { name: 'Close' }).click()

  await expect(page.getByRole('button', { name: 'SMT 01B' })).toBeVisible()
})
