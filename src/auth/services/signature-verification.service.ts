import { Injectable, UnauthorizedException } from '@nestjs/common';
import { verifyMessage } from 'ethers';

@Injectable()
export class SignatureVerificationService {
  /**
   * Verifies that a signature was created by the owner of the given address
   * @param address - The Ethereum address that should have signed the message
   * @param signature - The signature to verify
   * @param message - The original message that was signed
   * @returns true if the signature is valid, false otherwise
   */
  async verifySignature(
    address: string,
    signature: string,
    message: string,
  ): Promise<boolean> {
    try {
      const recoveredAddress = verifyMessage(message, signature);
      return recoveredAddress.toLowerCase() === address.toLowerCase();
    } catch (error) {
      throw new UnauthorizedException('Invalid signature format');
    }
  }

  /**
   * Validates that an Ethereum address has a valid format
   * @param address - The address to validate
   * @returns true if valid, false otherwise
   */
  isValidAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }
}
