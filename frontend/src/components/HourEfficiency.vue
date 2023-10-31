<template>
  <div class='rate'>
    {{ rate }}%
    <v-icon v-if="increase" color='green' class="icon">mdi-arrow-up-bold</v-icon>
    <v-icon v-if="decrease" color='red' class="icon">mdi-arrow-down-bold</v-icon>
  </div>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import api from '@/plugins/axios'

const rate = ref(0)
const increase= ref(false);
const decrease= ref(false);

onMounted(() => {
  getRate();
  setInterval(getRate, 1000 * 30)
})

function getRate() {
  api.get('/hourly').then(({data}) => {
    if (data > rate.value) {
      increase.value = true;
      decrease.value = false;
    } else {
      increase.value = false;
      decrease.value = true;
    }
    rate.value = data
  })
}
</script>

<style scoped>
.icon {
  position: relative;
  bottom: 2px;
}
</style>
