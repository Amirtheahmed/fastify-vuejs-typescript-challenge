<template>
  <div v-if="isApiLoading" class="loading-spinner"></div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue'

export default defineComponent({
  name: 'LoadingSpinner',
  setup() {
    const isApiLoading = inject('isApiLoading')

    return {
      isApiLoading
    }
  }
})
</script>

<style scoped></style>
