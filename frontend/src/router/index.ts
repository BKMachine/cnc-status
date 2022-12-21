import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import StatusView from '@/views/StatusView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/status',
      name: 'status',
      component: StatusView
    },
    {
      path: '/status/fullscreen',
      name: 'status/fullscreen',
      component: StatusView
    }
  ],
});

export default router;
