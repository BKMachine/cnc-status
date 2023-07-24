<template>
  <v-menu>
    <template #activator="{ props }">
      <img v-bind="props" :src="logo" alt="SETTINGS" />
    </template>
    <v-list>
      <v-list-item prepend-icon="mdi-undo-variant" @click="resetOrder"> Reset Order </v-list-item>
      <v-list-item
        prepend-icon="mdi-format-list-bulleted"
        @click="router.push({ name: 'machineList' })"
      >
        Machines
      </v-list-item>
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
  emits('clear-order');
}
</script>

<style scoped>
img {
  height: 50px;
  position: absolute;
  bottom: 10px;
  right: 10px;
}
</style>

<style>
.v-list-item__prepend > .v-icon {
  margin-inline-end: 16px !important;
}
</style>
