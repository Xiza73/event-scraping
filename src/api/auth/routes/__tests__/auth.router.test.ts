import { StatusCodes } from 'http-status-codes';
import request from 'supertest';

import { app } from '@/config/server.config';
import { clearDatabase, closeDatabase, connect } from '@/config/test-database.config';

vi.mock('@/config/logger.config', () => ({
  ...vi.importActual('@/config/logger.config'),
  logger: {
    error: vi.fn(),
  },
}));

beforeAll(async () => await connect());

afterEach(async () => await clearDatabase());

afterAll(async () => await closeDatabase());

describe('AuthRouter', () => {
  describe('POST /api/auth/check-session', () => {
    it('should return a success response for valid input', async () => {
      // Arrange

      // Act
      const response = await request(app).get('/api/auth/check-session');
      const responseBody = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.message).toContain('Session is active');
    });
  });
});
