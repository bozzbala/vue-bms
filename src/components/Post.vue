<script setup>
defineProps({
  post: {
    type: Object,
    required: true,
  },
})

import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import ConfirmDialog from './ConfirmDialog.vue'
import axios from '../services/api';

const authStore = useAuthStore()
const router = useRouter();
const showDialog = ref(false);
const loading = ref(false);

const canEdit = computed(() => {
  const perms = authStore.user?.permissions || []
  return perms.includes('manage_posts') || perms.includes('edit_posts')
})

const canDelete = computed(() => {
  const perms = authStore.user?.permissions || []
  return perms.includes('manage_posts') || perms.includes('delete_posts')
})

const emit = defineEmits(['deleted'])

function editPost(postId) {
  if (canEdit.value) {
    router.push(`/posts/${postId}/edit`)
  }
}

async function deletePost(postId) {
  if (!canDelete.value) return;

  showDialog.value = false;
  loading.value = true;
  try {
    await axios.delete(`/posts/${postId}`)
    emit('deleted', postId);
  } catch (error) {
    console.error('Failed to delete post:', error)
  } finally {
    loading.value = false;
  }

}
</script>

<template>
  <div class="block bg-white hover:shadow-md transition rounded-lg p-5 border border-gray-200 relative"
    :class="{ loading }">
    <a :href="`/posts/${post.id}`" class="text-xl font-semibold text-gray-800 mb-1 cursor-pointer hover:underline">
      {{ post.title }}
    </a>
    <p class="text-sm text-gray-500 mb-3">{{ $formatDate(post.created_at) }}</p>

    <div v-if="post.tags?.length" class="mb-2">
      <h4 class="text-sm font-medium text-gray-700 mb-1">Tags:</h4>
      <div class="flex flex-wrap gap-1">
        <span v-for="tag in post.tags" :key="tag"
          class="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">
          {{ tag }}
        </span>
      </div>
    </div>

    <div v-if="post.categories?.length">
      <h4 class="text-sm font-medium text-gray-700 mb-1">Categories:</h4>
      <div class="flex flex-wrap gap-1">
        <span v-for="category in post.categories" :key="category"
          class="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded">
          {{ category }}
        </span>
      </div>
    </div>

    <div class="buttons absolute top-4 right-4 flex gap-2">
      <button v-if="canEdit" @click.stop="editPost(post.id)"
        class="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
      <button v-if="canDelete" @click.stop="showDialog = true"
        class="text-red-600 hover:text-red-800 text-sm">Delete</button>
    </div>
  </div>

  <ConfirmDialog message="Вы уверены, что хотите удалить этот пост?" confirmText="Удалить" cancelText="Отмена"
    :show="showDialog" @confirm="deletePost(post.id)" @cancel="showDialog = false" />
</template>
