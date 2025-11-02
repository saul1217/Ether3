export class AuthResponseDto {
  accessToken: string;
  user: {
    address: string;
    ensName?: string;
    ensAvatar?: string;
  };
}
