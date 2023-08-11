<template>
  <div id="ScatterChart" style="height: 100%; width: 100%;"></div>
</template>
   
<script>
import * as echarts from "echarts/core";
export default {
  props: ["option"],
  data() {
    return {
      chart: null,
    }
  },
  mounted() {
    var chartDom = document.getElementById('ScatterChart');
    var chart = echarts.init(chartDom);

    function resizeChart() {
        chart.resize();
    }
    window.addEventListener("resize", resizeChart);
    resizeChart();

    this.chart = chart;
    this.chart.setOption({})
  },
  methods: {
    updateChart() {
        console.log("before set")
        this.chart.setOption(this.option);
        console.log("after set")
    }
  },
  watch: {
    option() {
      console.log(this.option)
      this.updateChart();
    }
  }
};
</script>
