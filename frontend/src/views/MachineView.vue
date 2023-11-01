<template>
  <v-btn color="blue" @click="router.push({ name: 'home' })">Home</v-btn>
  <v-card v-if="machine">
    <v-card-title class="text-h4">
      {{ machine.name }}
      <img :src="logos.brand[machine.brand]" alt="" />
    </v-card-title>
    <v-card-text> </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { computed } from 'vue';
import logos from '@/plugins/dynamic_logos';
import useMachineStore from '@/stores/machine';

const route = useRoute();
const router = useRouter();
const machineStore = useMachineStore();

const machine = computed((): MachineInfo | undefined => {
  return machineStore.machines.find((x: MachineInfo) => x.id === route.params.id);
});
</script>

<style scoped>
img {
  height: 25px;
}
</style>
