import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const DEFAULT_UPLOADS_DIRECTORY = resolve(process.cwd(), 'uploads')

export function getUploadsDirectory() {
  const configuredUploadsDirectory = process.env.UPLOADS_DIRECTORY?.trim()

  const uploadsDirectory = configuredUploadsDirectory
    ? resolve(configuredUploadsDirectory)
    : DEFAULT_UPLOADS_DIRECTORY

  mkdirSync(uploadsDirectory, { recursive: true })

  return uploadsDirectory
}
