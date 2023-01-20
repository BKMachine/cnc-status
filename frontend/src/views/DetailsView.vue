<template>
  <h1>{{ route.params.id }}</h1>
  <canvas id="c" width="720" height="20"></canvas>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { onMounted, onUnmounted } from 'vue';
import axios from '@/plugins/axios';

const route = useRoute();

let canvas: CanvasRenderingContext2D | null;
let timer: ReturnType<typeof setInterval>;

onMounted(() => {
  const c = document.getElementById('c') as HTMLCanvasElement | null;
  if (c) {
    const ctx = c.getContext('2d');
    if (ctx) canvas = ctx;
  }

  timer = setInterval(() => {
    getData();
  }, 5000);
  getData();
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

function getData() {
  axios.get(`/data/${route.params.id}`).then(({ data }) => {
    paint(data);
  });
}

function paint(data: any) {
  if (canvas) {
    const count = data.length;
    const width = canvas.canvas.width;
    const height = canvas.canvas.height;
    const pitch = width / count;
    canvas.clearRect(0, 0, width, height);
    for (let i = 0; i < data.length; i++) {
      const record = data[i];
      let color = '#878787';
      if (record.online === false) color = '#424242';
      else if (record.alarmed === true) color = '#ff0000';
      else if (record.running === true) color = '#00ff00';
      canvas.fillStyle = color;
      const startX = pitch * i;
      const endX = startX + pitch;
      if (i === 0) console.log(startX, endX);
      if (i === data.length - 1) console.log(startX, endX, data.length - 1);
      canvas.fillRect(startX, 0, endX, height);
    }
  }
}
</script>

<style scoped></style>
