import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { EnsService } from '../services/ens.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let ensService: EnsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            requestChallenge: jest.fn(),
            verifyAndAuthenticate: jest.fn(),
          },
        },
        {
          provide: EnsService,
          useValue: {
            getEnsProfile: jest.fn(),
          },
        },
      ],
    }).compile();
    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    ensService = module.get<EnsService>(EnsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('test', () => {
    it('should return status ok', () => {
      const result = controller.test();
      expect(result.status).toBe('ok');
    });
  });
});
