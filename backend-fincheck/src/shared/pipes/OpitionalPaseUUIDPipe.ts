import { ParseUUIDPipe, ArgumentMetadata } from '@nestjs/common';

export class OpitionalPaseUUIDPipe extends ParseUUIDPipe {
  override async transform(value: string, metadata: ArgumentMetadata) {
    if (typeof value === 'undefined') {
      return undefined;
    }

    return super.transform(value, metadata);
  }
}
