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
      <v-list-item prepend-icon="mdi-checkbox-blank-outline" @click="addBlankTile">
        Add Blank Tile
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import logo from '@/assets/bk-logo.png';
import { useRouter } from 'vue-router';
import useMachineStore from '@/stores/machine';

const router = useRouter();
const emits = defineEmits(['clear-order']);
const machineStore = useMachineStore();

function resetOrder() {
  localStorage.setItem('order', Array.from(Array(machineStore.machines.length).keys()).join(','));
  emits('clear-order');
}

function addBlankTile() {
  const nextIndex = machineStore.machines.length + machineStore.blanks.length;
  machineStore.addBlank(nextIndex);
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
