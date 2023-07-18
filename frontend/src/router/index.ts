import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import MachineView from '@/views/MachineView.vue';
import CreateMachineView from '@/views/CreateMachine.vue';
import MachineListView from '@/views/MachineListView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/machine/list',
      name: 'machineList',
      component: MachineListView,
    },
    {
      path: '/machine/create',
      name: 'machineCreate',
      component: CreateMachineView,
    },
    {
      path: '/machine/:id',
      name: 'machine',
      component: MachineView,
    },
  ],
});

export default router;
