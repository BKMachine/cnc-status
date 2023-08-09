<template>
  <h1>{{ route.params.id }}</h1>
  <v-btn color="blue" @click="router.push({ name: 'home' })">Home</v-btn>
  <div>
    {{ elastic.length }}
  </div>
  <div v-for="item in elastic" :key="item.id">
    {{ item['@timestamp'] }}
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import socket, { subscribe, unsubscribe } from '@/plugins/machine_status';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import axios from '@/plugins/axios';

const route = useRoute();
const router = useRouter();

const id = ref();

onMounted(() => {
  subscribe(route.params.id);
  id.value = route.params.id;
  mounted();
});

onBeforeUnmount(() => {
  unsubscribe(id.value);
});

const elastic = ref([]);

async function mounted() {
  axios
    .get(`/data/${id.value}`, {
      params: {
        minutes: 15,
      },
    })
    .then(({ data }) => {
      elastic.value = data;
    })
    .finally(() => {
      const sock = socket();
      if (!sock) return;
      sock.on('elastic-status', (data) => {
        console.log('GOT ELASTIC UPDATE');
        console.log(data);
      });
    });
}
</script>

<style scoped></style>
