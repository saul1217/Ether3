import { Injectable } from '@nestjs/common';
import { JsonRpcProvider } from 'ethers';

@Injectable()
export class EnsService {
  private readonly provider: JsonRpcProvider;

  constructor() {
    this.provider = new JsonRpcProvider(
      process.env.ETH_RPC_URL || 'https://eth.llamarpc.com',
    );
  }

  /**
   * Resolves an ENS name from an Ethereum address
   * @param address - The Ethereum address to resolve
   * @param chainId - The chain ID (default: 1 for Ethereum mainnet)
   * @returns The ENS name if found, null otherwise
   */
  async resolveEnsName(
    address: string,
    chainId: number = 1,
  ): Promise<string | null> {
    try {
      if (chainId !== 1) {
        return null;
      }
      const name = await this.provider.lookupAddress(address);
      return name || null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Resolves an ENS avatar URL from an ENS name
   * @param name - The ENS name to get the avatar for
   * @param chainId - The chain ID (default: 1 for Ethereum mainnet)
   * @returns The avatar URL if found, null otherwise
   */
  async resolveEnsAvatar(
    name: string,
    chainId: number = 1,
  ): Promise<string | null> {
    try {
      if (chainId !== 1) {
        return null;
      }
      const resolver = await this.provider.getResolver(name);
      if (!resolver) {
        return null;
      }
      const avatar = await resolver.getAvatar();
      return avatar?.url || null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Gets both ENS name and avatar for an address
   * @param address - The Ethereum address
   * @param chainId - The chain ID (default: 1 for Ethereum mainnet)
   * @returns Object with ensName and ensAvatar
   */
  async getEnsProfile(
    address: string,
    chainId: number = 1,
  ): Promise<{ ensName: string | null; ensAvatar: string | null }> {
    const ensName = await this.resolveEnsName(address, chainId);
    let ensAvatar = null;
    if (ensName) {
      ensAvatar = await this.resolveEnsAvatar(ensName, chainId);
    }
    return { ensName, ensAvatar };
  }
}
