import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { authService } from '../../services/authService';
import { productService } from '../../services/productService';

const mockApi = vi.hoisted(() => ({
  post: vi.fn(),
  get: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  patch: vi.fn(),
}));

// Mock API
vi.mock('../../services/api', () => ({
  default: mockApi,
  api: mockApi,
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('API Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Auth Flow Integration', () => {
    it('should complete full auth flow: register -> login -> get profile -> logout', async () => {
      const api = (await import('../../services/api')).default;
      
      // Mock register
      api.post.mockResolvedValueOnce({
        data: {
          user: { id: 1, name: 'Test User', email: 'test@example.com', role: 'buyer' },
          token: 'test-token',
        },
      });

      // Mock login
      api.post.mockResolvedValueOnce({
        data: {
          user: { id: 1, name: 'Test User', email: 'test@example.com', role: 'buyer' },
          token: 'test-token',
        },
      });

      // Mock get profile
      api.get.mockResolvedValueOnce({
        data: { id: 1, name: 'Test User', email: 'test@example.com', role: 'buyer' },
      });

      // Mock logout
      api.post.mockResolvedValueOnce({ data: { message: 'Logged out' } });

      // Register
      const registerResult = await authService.register({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        password_confirmation: 'password123',
        role: 'buyer',
      });
      expect(registerResult.data.user).toBeDefined();
      expect(registerResult.data.token).toBe('test-token');

      // Login
      const loginResult = await authService.login({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(loginResult.data.user).toBeDefined();
      expect(loginResult.data.token).toBe('test-token');

      // Get profile
      const profileResult = await authService.me();
      expect(profileResult.data.email).toBe('test@example.com');

      // Logout
      await authService.logout();
      expect(api.post).toHaveBeenCalledWith('/auth/logout');
    });
  });

  describe('Product Flow Integration', () => {
    it('should complete product flow: list -> detail -> create', async () => {
      const api = (await import('../../services/api')).default;

      // Mock list products
      api.get.mockResolvedValueOnce({
        data: {
          data: [
            { id: 1, title: 'Product 1', price: 99.99 },
            { id: 2, title: 'Product 2', price: 149.99 },
          ],
        },
      });

      // Mock get product detail
      api.get.mockResolvedValueOnce({
        data: { id: 1, title: 'Product 1', price: 99.99, description: 'Test' },
      });

      // Mock create product
      api.post.mockResolvedValueOnce({
        data: { id: 3, title: 'New Product', price: 199.99 },
      });

      // List products
      const listResult = await productService.getAll();
      expect(listResult.data.data).toHaveLength(2);

      // Get product detail
      const detailResult = await productService.getById(1);
      expect(detailResult.data.title).toBe('Product 1');

      // Create product
      const formData = new FormData();
      formData.append('title', 'New Product');
      formData.append('price', '199.99');
      const createResult = await productService.create(formData);
      expect(createResult.data.title).toBe('New Product');
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle API errors gracefully', async () => {
      const api = (await import('../../services/api')).default;

      api.get.mockRejectedValueOnce(new Error('Network Error'));

      await expect(productService.getAll()).rejects.toThrow('Network Error');
    });

    it('should handle 401 unauthorized errors', async () => {
      const api = (await import('../../services/api')).default;

      const error = new Error('Unauthorized');
      error.response = { status: 401 };
      api.get.mockRejectedValueOnce(error);

      await expect(productService.getMyProducts()).rejects.toThrow();
    });
  });
});
