import { Uploader } from '@/domain/forum/application/storage/uploader'
import { Module } from '@nestjs/common'
import { DiskStorage } from './disk-storage'

@Module({
  providers: [
    {
      provide: Uploader,
      useClass: DiskStorage,
    },
  ],
  exports: [Uploader],
})
export class StorageModule {}
