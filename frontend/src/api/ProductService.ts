import apiClient from './apiClient'
import type { Product } from '@/types/main'

export default {
  async getAllProducts(): Promise<Product[]> {
    return apiClient.get('/products').then((res: any) => res.data)
  },
  async addProduct(productData: FormData): Promise<Product> {
    return apiClient
      .post('/products', productData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      .then((res: any) => res.data)
  },
  async updateProduct(id: number, productData: FormData): Promise<Product> {
    return apiClient
      .post(`/products/${id}`, productData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      .then((res: any) => res.data)
  },
  async deleteProduct(id: number): Promise<void> {
    return apiClient.delete(`/products/${id}`).then((res: any) => res.data)
  }
}
