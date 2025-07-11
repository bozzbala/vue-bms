<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const title = ref('')
const content = ref('')
const status = ref('draft')
const selectedCategories = ref([])
const selectedTags = ref([])
const image = ref(null)

const allCategories = ref([])
const allTags = ref([])
const loading = ref(false)
const error = ref(null)

const canEdit = computed(() => {
    const perms = authStore.user?.permissions || []
    return perms.includes('edit_posts') || perms.includes('manage_posts')
})

onMounted(async () => {
    try {
        const [catRes, tagRes, postRes] = await Promise.all([
            api.get('/categories'),
            api.get('/tags'),
            api.get(`/posts/${route.params.id}`)
        ])
        allCategories.value = catRes.data.data
        allTags.value = tagRes.data.data

        const post = postRes.data.data || postRes.data
        title.value = post.title
        content.value = post.content
        status.value = post.status
        selectedCategories.value = post.categories.map(cat => cat.id)
        selectedTags.value = post.tags.map(tag => tag.id)
    } catch (err) {
        error.value = 'Ошибка загрузки данных'
        console.error(err)
    }
})

function onFileChange(e) {
    const file = e.target.files[0]
    if (file) {
        image.value = file
    }
}

async function submit() {
    if (!title.value.trim() || !content.value.trim()) {
        alert('Заполните заголовок и содержимое')
        return
    }

    loading.value = true
    const formData = new FormData()
    formData.append('title', title.value)
    formData.append('content', content.value)
    formData.append('status', status.value)
    selectedCategories.value.forEach(cat => formData.append('categories[]', cat))
    selectedTags.value.forEach(tag => formData.append('tags[]', tag))
    if (image.value) formData.append('featured_image', image.value)
    formData.append('_method', 'PUT')

    try {
        const res = await api.post(`/posts/${route.params.id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        router.push({ name: 'post-show', params: { id: route.params.id } })
    } catch (err) {
        error.value = 'Ошибка обновления поста'
        console.error(err)
    } finally {
        loading.value = false
    }
}

function goBack() {
    router.back()
}
</script>

<template>
    <div class="p-4 max-w-3xl mx-auto">
        <div class="mb-4">
            <button class="text-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded" @click="goBack">Back</button>
        </div>

        <h1 class="text-2xl font-bold mb-4">Редактировать пост</h1>

        <div v-if="!canEdit" class="text-red-600">
            У вас нет прав для редактирования постов.
        </div>

        <form v-else @submit.prevent="submit" class="space-y-4">
            <div>
                <label class="block font-medium">Заголовок</label>
                <input v-model="title" type="text" class="input w-full" required />
            </div>

            <div>
                <label class="block font-medium">Содержимое</label>
                <textarea v-model="content" rows="6" class="input w-full" required></textarea>
            </div>

            <div>
                <label class="block font-medium">Категории</label>
                <select multiple v-model="selectedCategories" class="input w-full">
                    <option v-for="cat in allCategories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                </select>
            </div>

            <div>
                <label class="block font-medium">Теги</label>
                <select multiple v-model="selectedTags" class="input w-full">
                    <option v-for="tag in allTags" :key="tag.id" :value="tag.id">{{ tag.name }}</option>
                </select>
            </div>

            <div>
                <label class="block font-medium">Новое изображение (необязательно)</label>
                <input type="file" @change="onFileChange" class="input" />
            </div>

            <div>
                <label class="block font-medium">Статус</label>
                <select v-model="status" class="input">
                    <option value="draft">Черновик</option>
                    <option value="published">Опубликовано</option>
                </select>
            </div>

            <div>
                <button type="submit" :disabled="loading" class="btn w-full">
                    {{ loading ? 'Сохраняем...' : 'Обновить пост' }}
                </button>
            </div>

            <div v-if="error" class="text-red-600 mt-2">{{ error }}</div>
        </form>
    </div>
</template>

<style scoped>
.input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 6px;
}

.btn {
    background: #3b82f6;
    color: white;
    padding: 0.5rem;
    border-radius: 6px;
}
</style>
