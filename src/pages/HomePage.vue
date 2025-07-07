<script setup>
import PostList from "@/views/PostList.vue";
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

async function logout() {
  try {
    await authStore.logout()
    router.push({ name: 'login' })
  } catch (error) {
    console.error('Logout error:', error)
  }
}
</script>

<template>
  <div class="p-4 flex justify-between items-center">
    <div>
      <h1 class="text-2xl font-bold">Home</h1>
      <p>Welcome to the Blog Management System</p>
    </div>
    <button @click="logout" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
      Logout
    </button>
  </div>

  <div class="border rounded m-4 p-4">
    <PostList />
  </div>
</template>
