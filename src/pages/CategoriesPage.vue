<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const categories = ref([])
const editingId = ref(null)
const editedName = ref('')
const error = ref(null)
const loading = ref(false)

const newCategoryName = ref('')
const creating = ref(false)

const canManageCategories = computed(() => {
  const perms = authStore.user?.permissions || []
  return perms.includes('manage_categories')
})

const canManageTags = computed(() => {
  const perms = authStore.user?.permissions || []
  return perms.includes('manage_tags')
})

async function fetchCategories() {
  loading.value = true
  try {
    const res = await api.get('/categories')
    categories.value = res.data.data
  } catch (e) {
    error.value = 'Failed to load categories'
  } finally {
    loading.value = false
  }
}

function startEdit(category) {
  editingId.value = category.id
  editedName.value = category.name
}

async function saveCategory(category) {
  if (!editedName.value.trim()) {
    alert('Name cannot be empty')
    return
  }

  try {
    const res = await api.put(`/categories/${category.id}`, {
      name: editedName.value.trim()
    })

    category.name = res.data.data.name
    editingId.value = null
    editedName.value = ''
  } catch (e) {
    alert('Error while saving')
    console.error(e)
  }
}

async function deleteCategory(category) {
  if (!confirm(`Are you sure you want to delete category "${category.name}"?`)) {
    return
  }

  try {
    await api.delete(`/categories/${category.id}`)
    categories.value = categories.value.filter(c => c.id !== category.id)
  } catch (e) {
    alert('Error while deleting category')
    console.error(e)
  }
}

async function createCategory() {
  const name = newCategoryName.value.trim()
  if (!name) {
    alert('Category name is required')
    return
  }

  creating.value = true
  try {
    const res = await api.post('/categories', { name })
    categories.value.push(res.data.data)
    newCategoryName.value = ''
  } catch (e) {
    alert('Error while creating category')
    console.error(e)
  } finally {
    creating.value = false
  }
}

onMounted(() => {
  if (canManageCategories) {
    fetchCategories()
  }
})
</script>

<template>
<div class="p-4 flex justify-between items-center">
    <div>
        <h1 class="text-2xl font-bold mb-4">Categories</h1>
    </div>
    <RouterLink :to="{name: 'home'}" class="bg-blue-500 !text-white px-4 py-2 rounded hover:bg-blue-600">
      Home
    </RouterLink>
    <RouterLink :to="{name: 'categories'}" class="bg-green-500 !text-white px-4 py-2 rounded hover:bg-green-600" v-if="canManageCategories">
      Categories
    </RouterLink>
    <RouterLink :to="{name: 'categories'}" class="bg-green-500 !text-white px-4 py-2 rounded hover:bg-green-600" v-if="canManageTags">
      Tags
    </RouterLink>
    <button @click="logout" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
      Logout
    </button>
  </div>
  <div class="p-6 max-w-2xl mx-auto">

    <div v-if="!canManageCategories" class="text-red-600">
      You do not have permission to manage categories.
    </div>

    <div v-else>
      <div v-if="error" class="text-red-600 mb-4">{{ error }}</div>

      <!-- Add Category Form -->
      <div class="mb-6">
        <h2 class="font-semibold mb-2">Add New Category</h2>
        <div class="flex gap-2">
          <input
            v-model="newCategoryName"
            placeholder="Category name"
            class="input flex-1"
          />
          <button @click="createCategory" :disabled="creating" class="btn">
            {{ creating ? 'Creating...' : 'Add' }}
          </button>
        </div>
      </div>

      <div v-if="loading" class="text-gray-500">Loading...</div>

      <ul v-else class="space-y-2">
        <li
          v-for="cat in categories"
          :key="cat.id"
          class="flex items-center justify-between bg-gray-100 p-3 rounded"
        >
          <div v-if="editingId === cat.id" class="flex-grow">
            <input v-model="editedName" class="input w-full" />
          </div>
          <div v-else class="flex-grow font-medium">
            {{ cat.name }}
          </div>

          <div class="ml-4 space-x-2 text-sm">
            <button
              v-if="editingId !== cat.id"
              @click="startEdit(cat)"
              class="text-blue-600 hover:underline"
            >
              Edit
            </button>
            <button
              v-else
              @click="saveCategory(cat)"
              class="text-green-600 hover:underline"
            >
              Save
            </button>
            <button
              @click="deleteCategory(cat)"
              class="text-red-600 hover:underline"
            >
              Delete
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.input {
  padding: 0.4rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.btn {
  background: #3b82f6;
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
}
</style>
