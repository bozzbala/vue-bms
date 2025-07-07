<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false);

function validate() {
    const trimmedName = username.value.trim()
    const trimmedEmail = email.value.trim()
    if (!trimmedName || !trimmedEmail || !password.value  || !confirmPassword.value) {
        alert('Введите обязательные поля')
        return false;
    }

    if(password.value !== confirmPassword.value) {
        alert('Пароли не совпадают')
        return false;
    }

    return true;
}

async function submit() {
  const trimmedName = username.value.trim()
  const trimmedEmail = email.value.trim()

  if(!validate()) {
    return;
  }

  loading.value = true;
  try {
    const response = await api.post('/register', {
      name: trimmedName,
      email: trimmedEmail,
      password: password.value,
      password_confirmation: confirmPassword.value,
    })

    if (response.status === 201) {
      const token = response.data.token
      localStorage.setItem('token', token)

      await router.push('/')
    }
  } catch (error) {
    if (error.response && error.response.data?.message) {
      alert('Ошибка: ' + error.response.data.message)
    } else {
      alert('Неизвестная ошибка при входе')
    }
  }
  loading.value = false;
}

onMounted(async () => {
    if (authStore.isAuthenticated) {
        await router.push('/')
    }
})
</script>

<template>
  <div class="p-4 max-w-md mx-auto">
    <h1 class="text-2xl font-bold mb-4">Регистрация</h1>
    <form @submit.prevent="submit" :class="{ loading: loading }">
      <div class="mb-3">
        <input
          v-model="username"
          type="text"
          placeholder="Имя"
          class="input"
          required
        />
      </div>
      <div class="mb-3">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="input"
          required
        />
      </div>
      <div class="mb-3">
        <input
          v-model="password"
          type="password"
          placeholder="Пароль"
          class="input"
          required
        />
      </div>
      <div class="mb-3">
        <input
          v-model="confirmPassword"
          type="password"
          placeholder="Подтвердите пароль"
          class="input"
          required
        />
      </div>
      <button type="submit" class="btn cursor-pointer">Зарегистрироваться</button>
    </form>
    <div class="mt-5">
        <p>Уже есть аккаунт? <router-link :to="{ name: 'login' }">Войти</router-link></p>
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
