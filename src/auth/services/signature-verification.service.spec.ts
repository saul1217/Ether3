import { Test, TestingModule } from '@nestjs/testing';
import { SignatureVerificationService } from './signature-verification.service';

describe('SignatureVerificationService', () => {
  let service: SignatureVerificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SignatureVerificationService],
    }).compile();
    service = module.get<SignatureVerificationService>(
      SignatureVerificationService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('isValidAddress', () => {
    it('should return true for valid Ethereum address', () => {
      const validAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';
      expect(service.isValidAddress(validAddress)).toBe(true);
    });

    it('should return false for invalid address', () => {
      const invalidAddress = '0xInvalid';
      expect(service.isValidAddress(invalidAddress)).toBe(false);
    });
  });
});
