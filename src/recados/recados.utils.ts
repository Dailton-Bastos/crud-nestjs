import { Injectable } from '@nestjs/common';

@Injectable()
export class RecadosUtils {
  inverteString(str: string) {
    return str.split('').reverse().join('');
  }
}
