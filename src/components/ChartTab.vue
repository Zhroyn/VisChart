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
  props: ['db', 'chartType'],
  components: {
    DefaultChart: DefaultChart,
    BarChart: BarChart,
    LineChart: LineChart,
  },
  watch: {
    db() {
      // const result = this.db.exec("SELECT * FROM food_security_and_health");
      // const rows = result[0].values;
      // rows.forEach(row => {
      //   console.log(`area: ${row[0]}, year: ${row[1]}`);
      // });
    }
  }
};
</script>
  