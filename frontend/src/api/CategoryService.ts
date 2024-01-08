import apiClient from './apiClient'
import type { Category, CategoryCreateUpdateDto } from '@/types/main'

export default {
  async getAllCategories(): Promise<Category[]> {
    return apiClient.get('/categories').then((res: any) => res.data)
  },
  async addCategory(category: CategoryCreateUpdateDto): Promise<Category> {
    return apiClient.post('/categories', category).then((res: any) => res.data)
  },
  async updateCategory(id: number, category: CategoryCreateUpdateDto): Promise<Category> {
    return apiClient.post(`/categories/${id}`, category).then((res: any) => res.data)
  },
  async deleteCategory(id: number): Promise<void> {
    return apiClient.delete(`/categories/${id}`).then((res: any) => res.data)
  }
}
