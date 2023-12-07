<template>
  <v-menu>
    <template #activator="{ props }">
      <div class="machine"></div>
    </template>
    <v-list>
      <v-list-item> Delete </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts"></script>

<style scoped>
.machine {
  width: 200px;
  height: 120px;
  border-radius: 10px;
}

.machine:hover {
  background: #5687d8;
}
</style>
