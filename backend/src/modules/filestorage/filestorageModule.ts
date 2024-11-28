import { Module } from '@nestjs/common';

import { FileStorageService } from './filestorageService';

@Module({
  controllers: [],
  providers: [FileStorageService],
  exports: [FileStorageService],
})
export class FileStorageModule {}
