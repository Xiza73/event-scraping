import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { authController } from '../auth.controller';

vi.mock('../../services/auth.service', () => ({
  authService: {
    checkSession: vi.fn(() => ({
      success: true,
      message: 'Session is active',
      responseObject: {},
      statusCode: StatusCodes.OK,
    })),
  },
}));

const res = {
  status: vi.fn(() => res),
  send: vi.fn(),
  json: vi.fn(),
} as unknown as Response;

beforeEach(() => {
  vi.clearAllMocks();
});

describe('AuthController', () => {
  describe('check session', () => {
    it('should send a success response', async () => {
      // Arrange
      const req = {} as unknown as Request;

      // Act
      await authController.checkSession(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        message: 'Session is active',
        responseObject: null,
        statusCode: StatusCodes.OK,
      });
    });
  });
});
