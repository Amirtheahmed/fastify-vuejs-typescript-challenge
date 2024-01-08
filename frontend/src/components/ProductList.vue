<template>
  <div class="p-4">
    <LoadingSpinner />
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-3xl font-bold">Products</h2>
      <button class="btn btn-secondary" @click="openAddModal">Add New Product</button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="product in products"
        :key="product.id"
        class="card card-compact bg-base-100 shadow-xl"
      >
        <figure>
          <img
            :src="`${baseUrl}${product.picture}`"
            alt="Product Image"
            class="h-48 w-full object-cover"
          />
        </figure>
        <div class="card-body">
          <h2 class="card-title">{{ product.name }}</h2>
          <p>Category: {{ product.category.name }}</p>
          <div class="card-actions justify-end">
            <button class="btn btn-secondary" @click="openEditModal(product)">Edit</button>
            <button class="btn btn-primary" @click="confirmDelete(product.id)">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="modal modal-open">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Editing Product: {{ editableProduct?.name }}</h3>
        <!-- Form for editing the product -->
        <form @submit.prevent="addOrUpdateProduct">
          <!-- Product Name -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Product Name</span>
            </label>
            <input
              type="text"
              v-if="editableProduct"
              v-model="editableProduct.name"
              class="input input-bordered"
            />
          </div>

          <!-- Product Category -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Category</span>
            </label>
            <select
              v-if="editableProduct"
              v-model="editableProduct.categoryId"
              class="select select-bordered"
            >
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>

          <!-- Image Upload -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Product Image</span>
            </label>
            <input type="file" @change="handleImageUpload" class="input input-bordered" />
          </div>

          <!-- Action Buttons -->
          <div class="modal-action">
            <button class="btn btn-primary" type="submit" :disabled="isApiLoading">Save</button>
            <button class="btn btn-ghost" @click="showEditModal = false">Close</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showConfirmationModal" class="modal modal-open">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Confirm Deletion</h3>
        <p>Are you sure you want to delete this product?</p>
        <div class="modal-action">
          <button class="btn btn-error" @click="deleteProduct">Delete</button>
          <button class="btn btn-ghost" @click="showConfirmationModal = false">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, provide, ref } from 'vue'
import type { Category, Product } from '@/types/main'
import ProductService from '@/api/ProductService'
import CategoriesService from '@/api/CategoryService'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

export default defineComponent({
  name: 'ProductList',
  components: { LoadingSpinner },
  setup() {
    const isApiLoading = ref(false)

    provide('isApiLoading', isApiLoading)
    const products = ref<Product[]>([])
    const categories = ref<Category[]>([])
    const showEditModal = ref(false)
    const editableProduct = ref<Product | null>(null)
    const showConfirmationModal = ref(false)
    let deletingProductId = ref<number | null>(null)
    const baseUrl = import.meta.env.VITE_APP_API_UPLOAD_URL

    const fetchCategories = async () => {
      try {
        const response = await CategoriesService.getAllCategories()
        categories.value = response as Category[]
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    }

    const fetchProducts = async () => {
      try {
        products.value = await ProductService.getAllProducts()
      } catch (error) {
        console.error('Failed to fetch products:', error)
      }
    }

    onMounted(fetchProducts)
    onMounted(fetchCategories)

    function openAddModal() {
      editableProduct.value = {
        id: 0,
        name: '',
        picture: '',
        categoryId: categories.value[0].id,
        category: categories.value[0]
      }
      showEditModal.value = true
    }

    const deleteProduct = async () => {
      if (deletingProductId.value !== null) {
        await ProductService.deleteProduct(deletingProductId.value)
        await fetchProducts() // Refresh the products list
        showConfirmationModal.value = false
      }
    }

    const handleImageUpload = (event: Event) => {
      const target = event.target as HTMLInputElement
      if (target && target.files && target.files.length > 0 && editableProduct.value) {
        const file = target.files[0]
        if (file) {
          editableProduct.value.picture = file
        }
      }
    }

    function confirmDelete(productId: number) {
      deletingProductId.value = productId
      showConfirmationModal.value = true
    }

    function openEditModal(product: Product) {
      editableProduct.value = { ...product }
      showEditModal.value = true
    }

    const addOrUpdateProduct = async () => {
      if (!editableProduct.value) return

      isApiLoading.value = true // Start loading

      const formData = new FormData()
      formData.append('name', editableProduct.value.name)
      formData.append('categoryId', String(editableProduct.value.categoryId))

      // Assuming editableProduct.value.picture is a File object
      if (editableProduct.value.picture instanceof File) {
        formData.append('picture', editableProduct.value.picture)
      }

      try {
        if (editableProduct.value.id) {
          // Update Product
          await ProductService.updateProduct(editableProduct.value.id, formData)
        } else {
          // Add New Product
          await ProductService.addProduct(formData)
        }
        await fetchProducts() // Refresh the products list
        showEditModal.value = false
      } catch (error) {
        console.error('Failed to save product:', error)
      } finally {
        isApiLoading.value = false
      }
    }

    return {
      products,
      openAddModal,
      showEditModal,
      editableProduct,
      confirmDelete,
      openEditModal,
      categories,
      showConfirmationModal,
      deletingProductId,
      deleteProduct,
      handleImageUpload,
      addOrUpdateProduct,
      baseUrl,
      isApiLoading
    }
  }
})
</script>
