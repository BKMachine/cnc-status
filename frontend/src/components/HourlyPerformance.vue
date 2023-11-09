<template>
  <div class="rate">
    {{ rate }}%
    <v-icon v-if="increase" color="green" class="icon">mdi-arrow-up-bold</v-icon>
    <v-icon v-if="decrease" color="red" class="icon">mdi-arrow-down-bold</v-icon>
  </div>

  <div class="chart-container">
    <LineChart :chartData="chartData" :options="options" class="chart" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import api from '@/plugins/axios';
import { LineChart } from 'vue-chart-3';
import { Chart, registerables, type ChartData, type ChartOptions } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

Chart.register(...registerables);
Chart.register(annotationPlugin);

const rate = ref(0);
const increase = ref(false);
const decrease = ref(false);
const percents = ref<number[]>([]);
const labels = ref<string[]>([]);
const chartData = computed<ChartData<'line'>>(() => {
  return {
    labels: labels.value,
    datasets: [
      {
        data: percents.value,
        tension: 0.4,
        cubicInterpolationMode: 'monotone',
        borderColor: '#258604',
      },
    ],
  };
});

const options = computed<ChartOptions<'line'>>(() => {
  return {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      annotation: {
        annotations: {
          line1: {
            type: 'line',
            yMin: rate.value,
            yMax: rate.value,
            borderColor: 'rgb(121,193,184)',
            borderWidth: 0.5,
          },
        },
      },
    },
    scales: {
      y: {
        display: false,
        title: {
          display: true,
          text: 'Percent',
        },
        //suggestedMin: 0,
        //suggestedMax: 100,
      },
    },
    interaction: {
      intersect: false,
    },
  };
});

onMounted(() => {
  getRate();
  setInterval(getRate, 1000 * 60);
});

function getRate() {
  api
    .get('/stats/hourly')
    .then(({ data }: { data: { rate: number; performance: Performance[] } }) => {
      percents.value = data.performance.map((x) => x._source.percent);
      labels.value = [];
      for (let i = 0; i < percents.value.length; i++) {
        labels.value.push('');
      }
      if (data.rate >= rate.value) {
        increase.value = true;
        decrease.value = false;
      } else {
        increase.value = false;
        decrease.value = true;
      }
      rate.value = data.rate;
    });
}
</script>

<style scoped>
.rate {
  position: absolute;
  bottom: 0;
}

.icon {
  position: relative;
  bottom: 2px;
}

.chart-container {
  position: absolute;
  height: 150px;
  width: 100%;
  bottom: 0;
}

.chart {
  display: inline-block;
  height: 100%;
  width: 80%;
  position: relative;
  left: 10%;
}
</style>
