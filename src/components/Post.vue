<script setup>
defineProps({
  post: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <a
    :href="'/posts/' + post.id"
    class="block bg-white hover:shadow-md transition rounded-lg p-5 border border-gray-200"
  >
    <h3 class="text-xl font-semibold text-gray-800 mb-1">{{ post.title }}</h3>
    <p class="text-sm text-gray-500 mb-3">{{ $formatDate(post.created_at) }}</p>

    <div v-if="post.tags?.length" class="mb-2">
      <h4 class="text-sm font-medium text-gray-700 mb-1">Tags:</h4>
      <div class="flex flex-wrap gap-1">
        <span
          v-for="tag in post.tags"
          :key="tag"
          class="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded"
        >
          {{ tag }}
        </span>
      </div>
    </div>

    <div v-if="post.categories?.length">
      <h4 class="text-sm font-medium text-gray-700 mb-1">Categories:</h4>
      <div class="flex flex-wrap gap-1">
        <span
          v-for="category in post.categories"
          :key="category"
          class="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded"
        >
          {{ category }}
        </span>
      </div>
    </div>
  </a>
</template>
