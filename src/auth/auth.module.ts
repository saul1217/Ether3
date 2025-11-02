import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { SignatureVerificationService } from './services/signature-verification.service';
import { EnsService } from './services/ens.service';
import { ChallengeService } from './services/challenge.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import jwtConfig from '@app/common/config/jwt.config';

@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(jwtConfig)],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: configService.get<string>('jwt.expiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    SignatureVerificationService,
    EnsService,
    ChallengeService,
    JwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
