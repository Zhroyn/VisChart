<template>
  <div class="box">
    <div class="header">
      <Header />
    </div>
    <div class="chart-select-tab shadow-lg">
      <ChartSelectTab
        @change-type="handleChangeChartType"
      />
    </div>
    <div class="tab2 shadow-lg">
      <div>Tab2</div>
    </div>
    <div class="chart-tab shadow-lg">
      <ChartTab
        :chartType="chart_type"
      />
    </div>
  </div>
</template>


<script>
import Header from './components/Header.vue'
import ChartTab from './components/ChartTab.vue'
import ChartSelectTab from './components/ChartSelectTab.vue'
export default {
  components: {
    Header: Header,
    ChartTab: ChartTab,
    ChartSelectTab: ChartSelectTab,
  },
  data () {
    return {
      chart_type: "default",
    }
  },
  methods: {
    handleChangeChartType(type) {
      this.chart_type = type;
    }
  }
}
</script>


<style scoped>
.box {
  height: 100%;
  display: grid;
  grid-gap: 16px;
  grid-template-columns: minmax(250px, 20%) auto;
  grid-template-rows: 64px 30% auto;
  grid-template-areas: 
    "header header"
    "tab1 chart"
    "tab2 chart";
}
.header {
  grid-area: header;
}
.chart-select-tab {
  grid-area: tab1;
}
.tab2 {
  grid-area: tab2;
}
.chart-tab {
  grid-area: chart;
}
.chart-select-tab, .tab2, .chart-tab {
  background-color: #ffffff;
  height: 100%;
  padding: 0.75rem;
  border-radius: 1rem
}

@media (max-width: 1024px) {
  .box {
    height: 100%;
    display: grid;
    grid-gap: 16px;
    grid-template-columns: minmax(250px, 1fr) minmax(250px, 1fr);
    grid-template-rows: 64px 30% auto;
    grid-template-areas: 
      "header header"
      "tab1 tab2"
      "chart chart";
  }
}
</style>

