<template>
  <h1>Create a new Machine</h1>
  <v-form @submit.prevent="submitForm">
    <v-row>
      <v-col cols="6">
        <v-text-field v-model="form.name" label="Name" :rules="rules"></v-text-field>
      </v-col>
      <v-col cols="6">
        <v-text-field v-model="form.serialNumber" label="Serial Number"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-radio-group v-model="form.brand" inline :rules="rules">
          <template #label>
            <span>Brand</span>
            <img :src="`http://127.0.0.1:3000/img/machine_logos/${form.brand}.png`" alt="" />
          </template>
          <v-radio label="Haas" value="haas"></v-radio>
          <v-radio label="Mori Sieki" value="mori"></v-radio>
          <v-radio label="Fanuc" value="fanuc"></v-radio>
          <v-radio label="Mazak" value="mazak"></v-radio>
          <v-radio label="Hanwha" value="hanwha"></v-radio>
          <v-radio label="Mitsubishi" value="mitsubishi"></v-radio>
          <v-radio label="Doosan" value="doosan"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-radio-group v-model="form.source" inline :rules="rules">
          <template #label>
            <span>Source</span>
            <img :src="`http://127.0.0.1:3000/img/${form.source}.png`" alt="" />
          </template>
          <v-radio label="Focas" value="focas"></v-radio>
          <v-radio label="Arduino" value="arduino"></v-radio>
          <v-radio label="MTConnect" value="mtconnect"></v-radio>
        </v-radio-group>
      </v-col>
      <v-col>
        <v-text-field v-model="form.location" :label="locationLabel" :rules="rules"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-radio-group v-model="form.type" inline label="Type" :rules="rules">
          <template #label>
            <span>Type</span>
            <img :src="`http://127.0.0.1:3000/img/${form.type}.png`" alt="" />
          </template>
          <v-radio label="Mill" value="mill"></v-radio>
          <v-radio label="Lathe" value="lathe"></v-radio>
          <v-radio label="Swiss" value="swiss"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-radio-group v-model="form.paths" inline label="Paths" :rules="rules">
          <v-radio label="Single" value="1"></v-radio>
          <v-radio label="Dual" value="2"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-btn type="submit">Submit</v-btn>
  </v-form>
</template>

<script setup lang="ts">
import axios from '@/plugins/axios';
import { ref, computed } from 'vue';

const form = ref({
  name: '',
  serialNumber: '',
  brand: '',
  source: '',
  type: '',
  paths: '1',
  location: '',
});

const rules = [
  (value: string) => {
    if (value) return true;
    return 'Required';
  },
];

const locationLabel = computed(() => {
  if (form.value.source === 'focas') return 'MQTT Name';
  else if (form.value.source === 'arduino') return 'Arduino URI Path';
  else if (form.value.source === 'mtconnect') return 'MTConnect Name';
  return 'Location';
});

function submitForm() {
  axios
    .post('/machine', form.value)
    .then((res) => {
      //Perform Success Action
    })
    .catch((error) => {
      // error.response.status Check status code
    })
    .finally(() => {
      //Perform action in always
    });
}
</script>

<style scoped>
img {
  height: 25px;
  margin-left: 10px;
}
</style>
