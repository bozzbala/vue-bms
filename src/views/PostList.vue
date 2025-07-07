<script setup>
import { ref, onMounted, computed } from 'vue'
import Post from '@/components/Post.vue'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const posts = ref([])
const isLoading = ref(false);
const authStore = useAuthStore();

async function getPosts() {
    isLoading.value = true;
    try {
        const response = await api.get('/posts')
        posts.value = response.data.data
    } catch (error) {
        console.error('Failed to load posts:', error)
    }
    isLoading.value = false;
}

const canCreate = computed(() => {
  const perms = authStore.user?.permissions || []
  return perms.includes('manage_posts') || perms.includes('publish_posts')
})

onMounted(() => {
    getPosts()
})
</script>

<template>
    <div class="p-4" :class="{ loading: isLoading }">
        <h1 class="text-xl font-semibold mb-4">Latest Posts</h1>
        <RouterLink v-if="canCreate" :to="{ name: 'post-create' }" class="focus:outline-none !text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 flex">Create new post</RouterLink>

        <div v-if="posts.length" class="space-y-4">
            <Post v-for="post in posts" :key="post.id" :post="post" />
        </div>
        <div v-else class="text-gray-500">No posts found.</div>
    </div>
</template>
