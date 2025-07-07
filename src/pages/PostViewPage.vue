<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const post = ref(null)
const loading = ref(true)
const error = ref(null)

// Проверка на право редактирования
const canEdit = computed(() => {
  const user = authStore.user
  return user && Array.isArray(user.permissions) && user.permissions.includes('edit_posts')
  return true;
})

onMounted(async () => {
  loading.value = true
  try {
    const response = await api.get(`/posts/${route.params.id}`)
    post.value = response.data.data || response.data
  } catch (err) {
    error.value = 'Failed to load post'
    console.error(err)
  } finally {
    loading.value = false
  }
})

function goBack() {
  router.back()
}

function goToEdit() {
  router.push({ name: 'post-edit', params: { id: post.value.id } })
}
</script>

<template>
  <div class="p-4 max-w-3xl mx-auto">
    <div v-if="loading">Loading...</div>
    <div v-else-if="error" class="text-red-600">{{ error }}</div>
    <div v-else>
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-3xl font-bold">{{ post.title }}</h1>
        <div class="flex gap-2">
          <button class="text-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded" @click="goBack">Back</button>
          <button
            v-if="canEdit"
            class="text-sm px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded"
            @click="goToEdit"
          >
            Edit
          </button>
        </div>
      </div>

      <div class="text-gray-500 mb-2">Created: {{ $formatDate(post.created_at) }}</div>

      <div class="mb-4" v-if="post.featured_image">
        <img :src="post.featured_image" alt="Featured" class="w-full max-h-96 object-cover rounded" />
      </div>

      <div class="prose mb-6" v-html="post.content"></div>

      <div class="mb-4">
        <strong class="mr-2">Tags:</strong>
        <span v-for="tag in post.tags" :key="tag" class="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
          {{ tag }}
        </span>
      </div>

      <div class="mb-4">
        <strong class="mr-2">Categories:</strong>
        <span v-for="category in post.categories" :key="category" class="inline-block bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
          {{ category }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
