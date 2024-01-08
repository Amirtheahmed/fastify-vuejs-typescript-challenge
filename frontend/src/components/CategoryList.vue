<template>
  <div class="p-4">
    <LoadingSpinner />
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-3xl font-bold">Categories</h2>
      <button class="btn btn-secondary" @click="openAddModal">Add New Category</button>
    </div>

    <div class="category-tree">
      <ul class="menu bg-base-100 rounded-box">
        <CategoryItem
          v-for="category in categories"
          :key="category.id"
          :category="category"
          @edit="openEditModal"
          @delete="openDeleteConfirmation"
        />
      </ul>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showEditModal" class="modal modal-open">
      <div class="modal-box">
        <h3 class="font-bold text-lg">{{ isEditing ? 'Edit' : 'Add' }} Category</h3>
        <form @submit.prevent="isEditing ? updateCategory() : addCategory()">
          <input
            type="text"
            placeholder="Category Name"
            v-if="editableCategory"
            v-model="editableCategory.name"
            class="input input-bordered w-full mb-4"
          />
          <select
            v-if="editableCategory"
            v-model="editableCategory.parentId"
            class="select select-bordered w-full mb-4"
          >
            <option value="">Select Parent Category (Optional)</option>
            <option v-for="category in flatCategories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
          <div class="modal-action">
            <button class="btn btn-primary" type="submit" :disabled="isApiLoading">
              {{ isEditing ? 'Update' : 'Add' }}
            </button>
            <button class="btn btn-ghost" @click="closeEditModal">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Confirmation Modal for Deletion -->
    <div v-if="showDeleteConfirmation" class="modal modal-open">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Confirm Deletion</h3>
        <p>Are you sure you want to delete this category?</p>
        <div class="modal-action">
          <button class="btn btn-error" @click="deleteCategory">Delete</button>
          <button class="btn btn-ghost" @click="showDeleteConfirmation = false">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, provide, ref } from 'vue'
import CategoriesService from '@/api/CategoryService'
import type { Category } from '@/types/main'
import CategoryItem from '@/components/CategoryItem.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

export default defineComponent({
  name: 'CategoryList',
  components: { LoadingSpinner, CategoryItem },
  setup() {
    const categories = ref<Category[]>([])
    const showEditModal = ref(false)
    const showDeleteConfirmation = ref(false)
    const editableCategory = ref<Category | null>(null)
    const isEditing = ref(false)
    const deletingCategoryId = ref<number | null>(null)
    const isApiLoading = ref(false)

    // Provide `isApiLoading` for child components
    provide('isApiLoading', isApiLoading)

    const fetchCategories = async () => {
      try {
        const response = await CategoriesService.getAllCategories()
        categories.value = buildCategoryTree(response as Category[])
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    }

    onMounted(fetchCategories)

    const flatCategories = computed(() => {
      // Flatten the categories for the parent category selector
      let flat: { id: number; name: string }[] = []
      function flatten(categories: Category[]) {
        for (let category of categories) {
          flat.push({ id: category.id, name: category.name })
          if (category.children) {
            flatten(category.children)
          }
        }
      }
      flatten(categories.value)
      return flat
    })

    const buildCategoryTree = (categories: Category[]): Category[] => {
      let map = new Map<number, Category & { children: Category[] }>()
      let tree: Category[] = []

      // Initialize the map with all categories and empty children arrays
      categories.forEach((cat) => {
        map.set(cat.id, { ...cat, children: [] })
      })

      categories.forEach((category) => {
        const currentCat = map.get(category.id)!
        if (category.parentId) {
          const parentCat = map.get(category.parentId)
          if (parentCat) {
            parentCat.children.push(currentCat)
          }
        } else {
          tree.push(currentCat)
        }
      })

      return tree
    }

    const openAddModal = () => {
      isEditing.value = false
      editableCategory.value = { id: 0, name: '' }
      showEditModal.value = true
    }

    const openEditModal = (category: Category) => {
      console.log('Editing category:', category) // Debugging line
      isEditing.value = true
      editableCategory.value = JSON.parse(JSON.stringify(category)) // Deep copy
      showEditModal.value = true
    }

    const closeEditModal = () => {
      showEditModal.value = false
    }

    const addCategory = async () => {
      if (editableCategory.value) {
        try {
          await CategoriesService.addCategory(editableCategory.value)
          await fetchCategories() // Refresh categories list
        } catch (error) {
          console.error('Failed to add category:', error)
        } finally {
          isApiLoading.value = false
        }
      }
      closeEditModal()
    }

    const updateCategory = async () => {
      if (editableCategory.value) {
        try {
          await CategoriesService.updateCategory(editableCategory.value.id, editableCategory.value)
          await fetchCategories() // Refresh categories list
        } catch (error) {
          console.error('Failed to update category:', error)
        } finally {
          isApiLoading.value = false
        }
      }
      closeEditModal()
    }

    const openDeleteConfirmation = (categoryId: number) => {
      deletingCategoryId.value = categoryId
      showDeleteConfirmation.value = true
    }

    const deleteCategory = async () => {
      if (deletingCategoryId.value) {
        try {
          await CategoriesService.deleteCategory(deletingCategoryId.value)
          await fetchCategories() // Refresh categories list
        } catch (error) {
          console.error('Failed to delete category:', error)
        } finally {
          isApiLoading.value = false
        }
      }
      showDeleteConfirmation.value = false
    }

    return {
      categories,
      showEditModal,
      editableCategory,
      isEditing,
      addCategory,
      updateCategory,
      closeEditModal,
      openAddModal,
      openEditModal,
      showDeleteConfirmation,
      openDeleteConfirmation,
      deleteCategory,
      flatCategories,
      CategoryItem,
      isApiLoading
    }
  }
})
</script>

<style scoped>
.category-tree span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.category-tree .menu > li > span {
  margin-bottom: 0.5em;
}

.category-tree ul {
  padding-left: 1em;
}
</style>
