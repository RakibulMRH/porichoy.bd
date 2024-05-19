/*import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
  private readonly algorithm = 'aes-256-ctr';
  private readonly secretKey = crypto.scryptSync('vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3', 'salt', 32);
  private readonly iv = crypto.randomBytes(16);

  encrypt(text: string): string {
    const cipher = crypto.createCipheriv(this.algorithm, this.secretKey, this.iv);
    return cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
  }

  decrypt(encryptedText: string): string {
    const decipher = crypto.createDecipheriv(this.algorithm, this.secretKey, this.iv);
    return decipher.update(encryptedText, 'hex', 'utf8') + decipher.final('utf8');
  }
}*/