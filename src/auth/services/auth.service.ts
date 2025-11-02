import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignatureVerificationService } from './signature-verification.service';
import { EnsService } from './ens.service';
import { ChallengeService } from './challenge.service';
import { AuthenticatedUser, JwtPayload } from '@app/common/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly signatureVerificationService: SignatureVerificationService,
    private readonly ensService: EnsService,
    private readonly challengeService: ChallengeService,
  ) {}

  /**
   * Generates a challenge for an address to sign
   * @param address - The Ethereum address
   * @returns The challenge message
   */
  async requestChallenge(address: string): Promise<string> {
    if (!this.signatureVerificationService.isValidAddress(address)) {
      throw new UnauthorizedException('Invalid Ethereum address');
    }
    return this.challengeService.generateChallenge(address);
  }

  /**
   * Verifies a signature and returns a JWT token along with user data
   * @param address - The Ethereum address
   * @param signature - The signature of the challenge
   * @param challenge - The original challenge message
   * @returns Authentication response with token and user data
   */
  async verifyAndAuthenticate(
    address: string,
    signature: string,
    challenge: string,
  ): Promise<{ accessToken: string; user: AuthenticatedUser }> {
    if (!this.signatureVerificationService.isValidAddress(address)) {
      throw new UnauthorizedException('Invalid Ethereum address');
    }
    if (!this.challengeService.validateChallenge(address, challenge)) {
      throw new UnauthorizedException('Invalid or expired challenge');
    }
    const isValid = await this.signatureVerificationService.verifySignature(
      address,
      signature,
      challenge,
    );
    if (!isValid) {
      throw new UnauthorizedException('Invalid signature');
    }
    const ensProfile = await this.ensService.getEnsProfile(address);
    const user: AuthenticatedUser = {
      address: address.toLowerCase(),
      ensName: ensProfile.ensName || undefined,
      ensAvatar: ensProfile.ensAvatar || undefined,
    };
    const payload: JwtPayload = {
      address: user.address,
      sub: user.address,
    };
    const accessToken = this.jwtService.sign(payload);
    this.challengeService.removeChallenge(address);
    return { accessToken, user };
  }

  /**
   * Validates a JWT token and returns the user payload
   * @param token - The JWT token
   * @returns The decoded payload
   */
  async validateToken(token: string): Promise<JwtPayload> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
