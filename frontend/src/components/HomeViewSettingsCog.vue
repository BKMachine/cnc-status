<template>
  <div @dblclick="resetOrder">
    <img :src="logo" alt="SETTINGS" />
  </div>
</template>

<script setup lang="ts">
import logo from '@/assets/bk-logo.png';
import { defineEmits } from 'vue';

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
