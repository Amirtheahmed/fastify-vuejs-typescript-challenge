<template>
  <li>
    <span>
      {{ category?.name }} ({{ category?._count?.products }})
      <span class="badge badge-secondary" @click="() => emitEdit(category)">Edit</span>
      <span class="badge badge-primary" @click="() => emitDelete(category.id)">Delete</span>
    </span>
    <ul v-if="category.children && category.children.length">
      <CategoryItem
        v-for="child in category.children"
        :key="child.id"
        :category="child"
        @edit="emitEdit"
        @delete="emitDelete"
      />
    </ul>
  </li>
</template>

<script lang="ts">
import type { Category } from '@/types/main'

export default {
  name: 'CategoryItem',
  props: {
    category: {
      type: Object as () => Category,
      required: true
    }
  },
  methods: {
    emitEdit(category: Category) {
      this.$emit('edit', category) // Propagate event up
    },
    emitDelete(categoryId: number) {
      this.$emit('delete', categoryId) // Propagate event up
    }
  }
}
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
