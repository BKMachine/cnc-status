<template>
  <v-btn color="blue" @click="router.push({ name: 'home' })">Home</v-btn>
  <v-card>
    <v-card-title class="text-h4">
      {{ machine.name }}
      <img :src="logos.brand[machine.brand]" alt="" />
    </v-card-title>
    <v-card-text>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { subscribe, unsubscribe } from '@/plugins/machine_status';
import { onBeforeUnmount, onMounted, ref, computed } from 'vue';
import { useStore } from '@/store'
import logos from '@/plugins/dynamic_logos';

const route = useRoute();
const router = useRouter();
const store = useStore()

const machine = computed((): MachineStatus => {
  return store.state.machines.find((x) => x.id === route.params.id)
})

const id = ref();

onMounted(() => {
  subscribe(route.params.id);
  id.value = route.params.id;
});

onBeforeUnmount(() => {
  unsubscribe(id.value);
});
</script>

<style scoped>
img {
  height: 25px;
}
</style>
