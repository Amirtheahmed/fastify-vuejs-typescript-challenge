<template>
  <div>
    <NavBar />
    <div class="container mx-auto p-4">
      <Categories />
      <ProductList />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import NavBar from './components/Navbar.vue'
import Categories from './components/CategoryList.vue'
import ProductList from './components/ProductList.vue'

export default defineComponent({
  components: {
    NavBar,
    Categories,
    ProductList
  }
})
</script>

<style>
/* Add global styles here */
</style>
