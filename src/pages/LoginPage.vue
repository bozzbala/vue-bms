<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const email = ref('')
const password = ref('')
const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false);

async function login() {
    const trimmedEmail = email.value.trim()
    if (!trimmedEmail || !password.value) {
        alert('Введите email и пароль')
        return
    }

    loading.value = true;
    try {
        await authStore.login({
            email: trimmedEmail,
            password: password.value,
        })

        await router.push('/')
    } catch (error) {
        if (error.response?.data?.message) {
            alert('Ошибка: ' + error.response.data.message)
        } else {
            alert('Неизвестная ошибка при входе')
        }
    } finally {
        loading.value = false
    }
}

onMounted(async () => {

    if (authStore.isAuthenticated) {
        await router.push('/')
    }
})
</script>

<template>
    <div class="p-4 max-w-md mx-auto">
        <h1 class="text-2xl font-bold mb-4">Login</h1>
        <form @submit.prevent="login" :class="{ loading: loading }">
            <div class="mb-3">
                <input v-model="email" type="email" placeholder="Email" class="input" required />
            </div>
            <div class="mb-3">
                <input v-model="password" type="password" placeholder="Password" class="input" required />
            </div>
            <button type="submit" class="btn cursor-pointer">Login</button>
        </form>
        <div class="mt-5">
            <p>Нет аккаунта? <router-link :to="{ name: 'signup' }">Зарегистрироваться</router-link></p>
        </div>
    </div>
</template>

<style scoped>
.input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 0.375rem;
}

.btn {
    background: #3b82f6;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    width: 100%;
}
</style>
