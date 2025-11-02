import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';

interface StoredChallenge {
  challenge: string;
  address: string;
  expiresAt: Date;
}

@Injectable()
export class ChallengeService {
  private readonly challenges: Map<string, StoredChallenge> = new Map();
  private readonly CHALLENGE_EXPIRY_MINUTES = 5;

  /**
   * Generates a unique challenge for an Ethereum address
   * @param address - The Ethereum address requesting the challenge
   * @returns The challenge string
   */
  generateChallenge(address: string): string {
    const randomString = randomBytes(32).toString('hex');
    const timestamp = Date.now();
    const challenge = `Please sign this message to authenticate.\n\nAddress: ${address}\nNonce: ${randomString}\nTimestamp: ${timestamp}`;
    const expiresAt = new Date(
      Date.now() + this.CHALLENGE_EXPIRY_MINUTES * 60 * 1000,
    );
    this.challenges.set(address.toLowerCase(), {
      challenge,
      address: address.toLowerCase(),
      expiresAt,
    });
    return challenge;
  }

  /**
   * Validates a challenge for an address
   * @param address - The Ethereum address
   * @param challenge - The challenge to validate
   * @returns true if valid, false otherwise
   */
  validateChallenge(address: string, challenge: string): boolean {
    const stored = this.challenges.get(address.toLowerCase());
    if (!stored) {
      return false;
    }
    if (stored.challenge !== challenge) {
      return false;
    }
    if (new Date() > stored.expiresAt) {
      this.challenges.delete(address.toLowerCase());
      return false;
    }
    return true;
  }

  /**
   * Removes a challenge after successful authentication
   * @param address - The Ethereum address
   */
  removeChallenge(address: string): void {
    this.challenges.delete(address.toLowerCase());
  }

  /**
   * Cleans up expired challenges (should be called periodically)
   */
  cleanupExpiredChallenges(): void {
    const now = new Date();
    for (const [address, challenge] of this.challenges.entries()) {
      if (now > challenge.expiresAt) {
        this.challenges.delete(address);
      }
    }
  }
}
