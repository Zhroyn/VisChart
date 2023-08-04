<template>
  <div class="h-full" v-if="chartType=='default'">
    <DefaultChart />
  </div>
  <div class="h-full" v-if="chartType=='bar'">
    <BarChart />
  </div>
  <div class="h-full" v-if="chartType=='line'">
    <LineChart />
  </div>
</template>


<script>
import DefaultChart from "./charts/DefaultChart.vue";
import BarChart from "./charts/BarChart.vue";
import LineChart from "./charts/LineChart.vue";
export default {
  props: ['chartType'],
  components: {
    DefaultChart: DefaultChart,
    BarChart: BarChart,
    LineChart: LineChart,
  },
};
</script>
  