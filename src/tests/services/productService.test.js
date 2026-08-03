import { describe, it, expect, vi, beforeEach } from 'vitest';
import { productService } from '../../services/productService';
import { api } from '../../services/api';

const mockApi = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  patch: vi.fn(),
}));

vi.mock('../../services/api', () => ({
  default: mockApi,
  api: mockApi,
}));

describe('productService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch all products with params', async () => {
      const mockParams = { page: 1, per_page: 10 };
      const mockResponse = { data: { data: [], meta: {} } };
      
      api.get.mockResolvedValue(mockResponse);

      const result = await productService.getAll(mockParams);

      expect(api.get).toHaveBeenCalledWith('/products', { params: mockParams });
      expect(result).toEqual(mockResponse);
    });

    it('should fetch all products without params', async () => {
      const mockResponse = { data: { data: [], meta: {} } };
      api.get.mockResolvedValue(mockResponse);

      await productService.getAll();

      expect(api.get).toHaveBeenCalledWith('/products', { params: {} });
    });
  });

  describe('getTopSelling', () => {
    it('should fetch top selling products', async () => {
      const mockResponse = { data: [] };
      api.get.mockResolvedValue(mockResponse);

      const result = await productService.getTopSelling();

      expect(api.get).toHaveBeenCalledWith('/products/top-selling', { params: { limit: 8 } });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getById', () => {
    it('should fetch product by id', async () => {
      const mockProduct = { id: 1, title: 'Test Product' };
      api.get.mockResolvedValue({ data: mockProduct });

      const result = await productService.getById(1);

      expect(api.get).toHaveBeenCalledWith('/products/1');
      expect(result).toEqual({ data: mockProduct });
    });
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const mockFormData = new FormData();
      const mockResponse = { data: { id: 1, title: 'New Product' } };
      api.post.mockResolvedValue(mockResponse);

      const result = await productService.create(mockFormData);

      expect(api.post).toHaveBeenCalledWith('/products', mockFormData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const mockFormData = new FormData();
      const mockResponse = { data: { id: 1, title: 'Updated Product' } };
      api.post.mockResolvedValue(mockResponse);

      const result = await productService.update(1, mockFormData);

      expect(api.post).toHaveBeenCalledWith('/products/1', mockFormData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('delete', () => {
    it('should delete a product', async () => {
      api.delete.mockResolvedValue({ data: { message: 'Deleted' } });

      await productService.delete(1);

      expect(api.delete).toHaveBeenCalledWith('/products/1');
    });
  });
});
