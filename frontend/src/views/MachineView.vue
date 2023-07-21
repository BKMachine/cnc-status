<template>
  <h1>{{ route.params.id }}</h1>
  <v-btn color="blue" @click="router.push({ name: 'home' })">Home</v-btn>
  <v-btn color="purple" @click="hideMachine">Hide from Home View</v-btn>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { hide } from '@/plugins/hide_machine';

const route = useRoute();
const router = useRouter();

function hideMachine() {
  hide(route.params.id as string);
  router.push({ name: 'home' });
}
</script>

<style scoped></style>
