<template>
  <h1>Machine List</h1>
  <v-btn color="primary" @click="router.push({ name: 'machineCreate' })">Add Machine</v-btn>

  <div v-for="item in store.state.machines" :key="item.id" class="machine">
    <span class="name">{{ item.name }}</span>
    <img :src="item.logo" alt="logo" />
    <span>{{ item.location }}</span>
    <span>{{ item.source }}</span>
    <span>{{ item.type }}</span>
    <span>{{ item.paths }}</span>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useStore } from '@/store';

const router = useRouter();
const store = useStore();
</script>

<style scoped>
.machine {
  color: #fff;
  font-size: 24px;
  padding: 5px;
  border: 1px solid #000;
  border-radius: 10px;
  margin: 5px;
  background: #6c6c6c;
}

.machine img {
  height: 24px;
}
.name {
}
</style>
