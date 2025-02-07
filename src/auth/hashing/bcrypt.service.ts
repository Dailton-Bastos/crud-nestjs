import * as bcrypt from 'bcryptjs';
import { HashingService } from './hashing.service';

export class BcryptService extends HashingService {
  constructor() {
    super();
  }

  async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);

    return bcrypt.hash(password, salt);
  }

  async compare(password: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
  }
}
