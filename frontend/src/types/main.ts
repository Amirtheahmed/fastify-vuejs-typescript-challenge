export interface Category {
  id: number
  name: string
  parentId?: number | null
  children?: Category[]
  _count?: {
    products: number
  }
}

export interface Product {
  id: number
  name: string
  picture: string | File
  categoryId: number
  category: ProductCategory
}

export interface ProductCategory {
  id: number
  name: string
}

export interface CategoryCreateUpdateDto {
  name: string
  parentId?: number | null
}
