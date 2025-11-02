import { IsString, IsEthereumAddress } from 'class-validator';

export class RequestChallengeDto {
  @IsString()
  @IsEthereumAddress()
  address: string;
}
