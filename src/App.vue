<script setup>
  import Header from './components/Header.vue'
  import Chart from './components/Chart.vue'
</script>


<template>
  <div class="box">
    <div class="header m-4">
      <Header />
    </div>
    <div class="tab1 ml-4 mt-4">
      <div class="h-full shadow-lg p-4">Tab1</div>
    </div>
    <div class="tab2 ml-4 mb-4">
      <div class="h-full shadow-lg p-4">Tab2</div>
    </div>
    <div class="chart mr-4 mt-4 mb-4">
      <div class="h-full shadow-lg p-4">
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
  font-size: 150%;
}
.two { 
  background: #8CC7B5;
}
.three {
  background: #D1BA74;
}
.four {
  background: #BEE7E9;
}
.five {
  background: #E6CEAC;
}
.six {
  background: #ECAD9E;
}
.item {
  text-align: center;
  font-size: 200%;
  color: #fff;
}
</style>

