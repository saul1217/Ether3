import { IsString, IsEthereumAddress } from 'class-validator';

export class VerifySignatureDto {
  @IsString()
  @IsEthereumAddress()
  address: string;

  @IsString()
  signature: string;

  @IsString()
  challenge: string;
}
