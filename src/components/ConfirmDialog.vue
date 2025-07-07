<script setup>
import { ref } from 'vue'

defineProps({
  message: {
    type: String,
    default: 'Вы уверены, что хотите продолжить?'
  },
  confirmText: {
    type: String,
    default: 'Да'
  },
  cancelText: {
    type: String,
    default: 'Отмена'
  },
  show: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['confirm', 'cancel'])

function confirm() {
  emit('confirm')
}

function cancel() {
  emit('cancel')
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.8)]">
    <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
      <h2 class="text-lg font-semibold mb-4">Подтверждение действия</h2>
      <p class="text-gray-700 mb-6">{{ message }}</p>
      <div class="flex justify-end gap-3">
        <button @click="cancel" class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded">
          {{ cancelText }}
        </button>
        <button @click="confirm" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded">
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>
