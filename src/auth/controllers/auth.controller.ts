import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RequestChallengeDto } from '../dto/request-challenge.dto';
import { VerifySignatureDto } from '../dto/verify-signature.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { EnsService } from '../services/ens.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly ensService: EnsService,
  ) {}

  /**
   * Request a challenge message to sign with MetaMask
   * POST /auth/challenge
   */
  @Post('challenge')
  @HttpCode(HttpStatus.OK)
  async requestChallenge(
    @Body() requestChallengeDto: RequestChallengeDto,
  ): Promise<{ challenge: string }> {
    const challenge = await this.authService.requestChallenge(
      requestChallengeDto.address,
    );
    return { challenge };
  }

  /**
   * Verify signature and authenticate user
   * POST /auth/verify
   */
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verifySignature(
    @Body() verifySignatureDto: VerifySignatureDto,
  ): Promise<AuthResponseDto> {
    const result = await this.authService.verifyAndAuthenticate(
      verifySignatureDto.address,
      verifySignatureDto.signature,
      verifySignatureDto.challenge,
    );
    return result;
  }

  /**
   * Get current authenticated user profile
   * GET /auth/me
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: any): Promise<{
    address: string;
    ensName?: string;
    ensAvatar?: string;
  }> {
    const address = req.user.address;
    const ensProfile = await this.ensService.getEnsProfile(address);
    return {
      address,
      ensName: ensProfile.ensName || undefined,
      ensAvatar: ensProfile.ensAvatar || undefined,
    };
  }

  /**
   * Get ENS profile for an address
   * GET /auth/ens/:address
   */
  @Get('ens/:address')
  async getEnsProfile(@Request() req: any): Promise<{
    address: string;
    ensName?: string;
    ensAvatar?: string;
  }> {
    const address = req.params.address;
    const ensProfile = await this.ensService.getEnsProfile(address);
    return {
      address,
      ensName: ensProfile.ensName || undefined,
      ensAvatar: ensProfile.ensAvatar || undefined,
    };
  }

  /**
   * Smoke test endpoint
   * GET /auth/test
   */
  @Get('test')
  test(): { status: string; message: string } {
    return {
      status: 'ok',
      message: 'Auth module is working',
    };
  }
}
