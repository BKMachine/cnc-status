<template>
  <h1>{{ route.params.id }}</h1>
  <button @click="router.push({ name: 'home' })">Home</button>
  <button @click="hide">Hide from Home View</button>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

function hide() {
  const hidden = localStorage.getItem('hidden');
  const hiddenArray = hidden ? hidden.split(',') : [];
  const id = route.params.id as string;
  if (!hiddenArray.includes(id)) {
    hiddenArray.push(id);
    localStorage.setItem('hidden', hiddenArray.join(','));
  }
  router.push({ name: 'home' });
}
</script>

<style scoped></style>
