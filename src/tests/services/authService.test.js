import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '../../services/authService';
import { api } from '../../services/api';

const mockApi = vi.hoisted(() => ({
  post: vi.fn(),
  get: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  patch: vi.fn(),
}));

vi.mock('../../services/api', () => ({
  default: mockApi,
  api: mockApi,
}));

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('should call API with correct data', async () => {
      const mockData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        password_confirmation: 'password123',
        role: 'buyer',
      };
      
      api.post.mockResolvedValue({ data: { user: mockData, token: 'mock-token' } });

      const result = await authService.register(mockData);

      expect(api.post).toHaveBeenCalledWith('/auth/register', mockData);
      expect(result).toEqual({ data: { user: mockData, token: 'mock-token' } });
    });

    it('should handle API errors', async () => {
      const mockError = new Error('Registration failed');
      api.post.mockRejectedValue(mockError);

      await expect(authService.register({})).rejects.toThrow('Registration failed');
    });
  });

  describe('login', () => {
    it('should call API with correct credentials', async () => {
      const mockCredentials = {
        email: 'test@example.com',
        password: 'password123',
      };
      
      api.post.mockResolvedValue({ data: { user: { id: 1, email: 'test@example.com' }, token: 'mock-token' } });

      const result = await authService.login(mockCredentials);

      expect(api.post).toHaveBeenCalledWith('/auth/login', mockCredentials);
      expect(result).toEqual({ data: { user: { id: 1, email: 'test@example.com' }, token: 'mock-token' } });
    });
  });

  describe('logout', () => {
    it('should call API logout endpoint', async () => {
      api.post.mockResolvedValue({ data: { message: 'Logged out' } });

      await authService.logout();

      expect(api.post).toHaveBeenCalledWith('/auth/logout');
    });
  });

  describe('me', () => {
    it('should fetch current user', async () => {
      const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' };
      api.get.mockResolvedValue({ data: mockUser });

      const result = await authService.me();

      expect(api.get).toHaveBeenCalledWith('/auth/me');
      expect(result).toEqual({ data: mockUser });
    });
  });

  describe('updateProfile', () => {
    it('should update profile with FormData', async () => {
      const mockData = new FormData();
      mockData.append('name', 'Updated Name');
      
      api.post.mockResolvedValue({ data: { name: 'Updated Name' } });

      const result = await authService.updateProfile(mockData);

      expect(api.post).toHaveBeenCalledWith('/auth/profile', mockData);
      expect(result).toEqual({ data: { name: 'Updated Name' } });
    });
  });
});
