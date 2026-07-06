import {
  UploadParams,
  Uploader,
} from '@/domain/forum/application/storage/uploader'

import { Injectable } from '@nestjs/common'
import { randomUUID } from 'node:crypto'
import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { getUploadsDirectory } from './uploads-directory'

@Injectable()
export class DiskStorage implements Uploader {
  async upload({ fileName, body }: UploadParams): Promise<{ url: string }> {
    const uploadId = randomUUID()
    const sanitizedFileName = fileName.replace(/[^\w.\-() ]/g, '_')
    const uniqueFileName = `${uploadId}-${sanitizedFileName}`

    await writeFile(join(getUploadsDirectory(), uniqueFileName), body)

    return {
      url: `/uploads/${uniqueFileName}`,
    }
  }
}
