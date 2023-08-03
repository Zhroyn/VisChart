<script setup>
  import Header from './components/Header.vue'
  import Chart from './components/Chart.vue'
</script>


<template>
  <div class="box">
    <div class="header">
      <Header />
    </div>
    <div class="tab1 shadow-lg">
      <div>Tab1</div>
    </div>
    <div class="tab2 shadow-lg">
      <div>Tab2</div>
    </div>
    <div class="chart shadow-lg">
      <div class="h-full">
        <Chart />
      </div>
    </div>
  </div>
</template>


<style>
.box {
  height: 100%;
  display: grid;
  grid-gap: 16px;
  grid-template-columns: 20% auto;
  grid-template-rows: 64px 30% auto;
  grid-template-areas: 
    "header header"
    "tab1 chart"
    "tab2 chart";
}
.header {
  grid-area: header;
}
.tab1 {
  grid-area: tab1;
}
.tab2 {
  grid-area: tab2;
}
.chart {
  grid-area: chart;
}
.tab1, .tab2, .chart {
  background-color: #ffffff;
  font-size: 135%;
  height: 100%;
  padding: 1rem;
  border-radius: 1rem
}
</style>

