<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

onMounted(async () => {
  if (authStore.token && !authStore.user) {
    try {
      await authStore.fetchUser()
    } catch (error) {
      authStore.logout()
    }
  }
})
</script>

<template>
  <div
    v-if="authStore.isLoading"
    class="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50"
  >
    <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>

  <RouterView v-else />
</template>

<style scoped></style>
