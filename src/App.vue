<template>
  <div class="box">
    <div class="header">
      <Header
        @file-upload="handleDataChange"
      />
    </div>
    <div class="chart-select-tab shadow-lg">
      <ChartSelectTab
        @type-change="handleTypeChange"
      />
    </div>
    <div class="data-set-tab shadow-lg overflow-y-scroll no-scrollbar">
      <DataSetTab
        :db="db"
        :chart-type="chartType"
        @set-change="handleSetChange"
      />
    </div>
    <div class="chart-tab shadow-lg">
      <ChartTab
        :db="db"
        :chart-type="chartType"
      />
    </div>
  </div>
</template>


<script>
import Header from './components/Header.vue'
import ChartTab from './components/ChartTab.vue'
import ChartSelectTab from './components/ChartSelectTab.vue'
import DataSetTab from './components/DataSetTab.vue'
export default {
  components: {
    Header: Header,
    ChartTab: ChartTab,
    ChartSelectTab: ChartSelectTab,
    DataSetTab: DataSetTab,
  },
  data () {
    return {
      chartType: "default",
      db: null,
    }
  },
  methods: {
    handleTypeChange(type) {
      this.chartType = type;
    },
    handleDataChange(db) {
      this.db = db;
    },
    handleSetChange(fields) {
      ;
    }
  }
}
</script>


<style scoped>
.box {
  height: 100%;
  display: grid;
  grid-gap: 16px;
  grid-template-columns: minmax(300px, 22%) auto;
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
.data-set-tab {
  grid-area: tab2;
}
.chart-tab {
  grid-area: chart;
}
.chart-select-tab, .data-set-tab, .chart-tab {
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
    grid-template-columns: minmax(250px, 1fr) minmax(400px, 2fr);
    grid-template-rows: 64px 30% auto;
    grid-template-areas: 
      "header header"
      "tab1 tab2"
      "chart chart";
  }
}
</style>

