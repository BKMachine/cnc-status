<template>
  <h1>Machine List</h1>
  <button @click="router.push({ name: 'machineCreate' })">Add Machine</button>
  <div v-for="item in machines" :key="item.id" class="machine">
    <span class="name">{{ item.name }}</span>
    <img :src="item.logo" alt="logo" />
    <span>{{ item.location }}</span>
    <span>{{ item.source }}</span>
    <span>{{ item.type }}</span>
    <span>{{ item.paths }}</span>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import axios from '@/plugins/axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const machines = ref([] as MachineStatus[]);

onMounted(() => {
  axios.get('/status').then(({ data }) => {
    machines.value = data;
  });
});
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
