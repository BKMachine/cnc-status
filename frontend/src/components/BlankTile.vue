<template>
  <div class="machine">
    <v-icon icon="mdi-close" class="trash" @click="removeBlank"></v-icon>
  </div>
</template>

<script setup lang="ts">
import useMachineStore from '@/stores/machine';

const props = defineProps<{
  index: number;
}>();
const machineStore = useMachineStore();

function removeBlank() {
  machineStore.removeBlank(props.index);
}
</script>

<style scoped>
.machine {
  width: 200px;
  height: 120px;
  border-radius: 10px;
  position: relative;
}

.machine:hover {
  background: #5687d8;
}

.trash {
  position: absolute;
  right: 5px;
  top: 5px;
  cursor: pointer;
  display: none;
}

.machine:hover > .trash {
  display: inline-block;
}
</style>
