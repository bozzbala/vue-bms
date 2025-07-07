import { defineStore } from 'pinia';
import axios from '../services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || '',
    isLoading: false,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
  },
  actions: {
    async login(payload) {
      const { data } = await axios.post('/login', payload);
      this.user = data.user;
      this.token = data.token;
      localStorage.setItem('token', this.token);
    },
    async logout() {
      await axios.post('/logout');
      this.user = null;
      this.token = '';
      localStorage.removeItem('token');
    },
    async fetchUser() {
      this.isLoading = true;
      try {
        const { data } = await axios.get('/me');
        this.user = data;
      } catch (error) {
        this.logout();
      } finally {
        this.isLoading = false;
      }
    },
  },
});
