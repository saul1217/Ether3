export interface ChallengeResponse {
  challenge: string;
  expiresAt: Date;
}

export interface AuthenticatedUser {
  address: string;
  ensName?: string;
  ensAvatar?: string;
}

export interface JwtPayload {
  address: string;
  sub: string;
}
