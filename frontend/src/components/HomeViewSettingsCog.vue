<template>
  <v-menu>
    <template #activator="{ props }">
      <img v-bind="props" :src="logo" alt="SETTINGS" />
    </template>
    <v-list>
      <v-list-item @click="resetOrder"> Reset Order </v-list-item>
      <v-list-item @click="router.push({ name: 'machineList' })">Machines</v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import logo from '@/assets/bk-logo.png';
import { useRouter } from 'vue-router';

const router = useRouter();
const emits = defineEmits(['clear-order']);

function resetOrder() {
  localStorage.removeItem('order');
  localStorage.removeItem('hidden');
  emits('clear-order');
}
</script>

<style scoped>
img {
  height: 50px;
}
</style>
