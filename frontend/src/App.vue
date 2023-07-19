<template>
  <v-app>
    <v-main>
      <v-container fluid>
        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import '@/plugins/machine_status';
</script>

<style scoped></style>
