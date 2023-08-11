<template>
  <div :class="layout.haveSidebar ? 'with-sidebar' : 'nosidebar'">
    <div class="header">
      <Header
        @interface-component-switch="handleComponentSwitch"
        @chart-layout-change="handleChartLayoutChange"
        @file-upload="handleDataChange" />
    </div>

    <div v-if="layout.haveSidebar"
      class="chart-select-tab shadow-lg">
      <ChartSelectTab 
        :setting="settings[selectedChartIdx]"
        :chart-idx="selectedChartIdx"
        :have-tooltip="layout.haveViewTooltip" />
      </div>
      
      <div v-if="layout.haveSidebar"
        class="data-set-tab shadow-lg overflow-y-scroll no-scrollbar">
      <DataSetTab
        :db="db" 
        :setting="settings[selectedChartIdx]"
        :chart-idx="selectedChartIdx"
        :chart-layout="layout.chartLayout"
        @apply-to-chart="updateChart = !updateChart" />
      </div>
      
      <div class="charts">
        <div v-if="refreshAllCharts" :class="layout.chartLayout">
          <div v-for="i in settings.length" :class="'c' + i + ' shadow-lg'">
            <ChartTab
            :db="db"
            :setting="settings[i - 1]"
            :settings="settings"
            :update="updateChart"
            @apply-to-chart="updateChart = !updateChart"
            @click="selectedChartIdx = i - 1" />
        </div>
      </div>
    </div>
    <!-- <button class="btn" @click="settings[0][1] += 1">{{ settings[0] }}</button> -->
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
      db: null,
      fields: [],
      settings: [{fields:[]}],
      selectedChartIdx: 0,
      
      refreshAllCharts: true,
      updateChart: true,

      layout: {
        haveSidebar: true,
        haveViewTooltip: true,
        chartLayout: "one-chart"
      },
    }
  },
  methods: {
    handleDataChange(db) {
      this.db = db;
    },
    handleComponentSwitch(component) {
      this.layout[component] = !this.layout[component];
    },
    handleChartLayoutChange(chartLayout) {
      this.layout.chartLayout = chartLayout;
    },
    handleSettingChange(fields) {
      this.fieldSettings = fields;
    },
    addFieldsSetting() {
      for (let i = 0; i < this.settings.length; i++) {
        this.settings[i].fields = JSON.parse(JSON.stringify(this.fields));
      }
    }
  },
  watch: {
    'layout.chartLayout' (newLayout) {
      this.selectedChartIdx = 0;
      if (newLayout.includes('one')) {
        this.settings = [{}];
      } else if (newLayout.includes('two')) {
        this.settings = [{}, {}];
      } else if (newLayout.includes('three')) {
        this.settings = [{}, {}, {}];
      }

      this.addFieldsSetting();

      this.refreshAllCharts = false;
      this.$nextTick(() => {
        this.refreshAllCharts = true;
      })
    },
    db() {
      var stmt = `SELECT name FROM sqlite_master WHERE type='table'`;
      var result = this.db.exec(stmt);
      const tableNames = result[0].values;

      this.fields = [];
      for (let tableName of tableNames) {
        tableName = tableName[0]
        stmt = `PRAGMA table_info([${tableName}])`;
        result = this.db.exec(stmt);
        
        for (let fieldInfo of result[0].values) {
          var field = {};
          field.tableName = tableName;
          field.fieldName = fieldInfo[1];
          field.fieldType = fieldInfo[2];
          field.bindTo = null;
          field.relateTo = null;

          if (field.fieldType != 'REAL') {
            field.sendTo = null;
            field.selected = null;
            field.selectable = [];
            const stmt = `SELECT DISTINCT [${field.fieldName}]
                          FROM [${field.tableName}]`
            const results = this.db.exec(stmt);
            for (let row of results[0].values) {
              field.selectable.push(row[0])
            }
          }

          this.fields.push(field)
        }
      }
      
      this.addFieldsSetting();
    },
  }
}
</script>


<style scoped>
.header {
  grid-area: header;
}
.chart-select-tab {
  grid-area: tab1;
}
.data-set-tab {
  grid-area: tab2;
}
.charts {
  grid-area: charts;
}
.with-sidebar {
  height: 100%;
  grid-gap: 12px;
  display: grid;
  grid-template-columns: minmax(300px, 22%) auto;
  grid-template-rows: 64px 30% auto;
  grid-template-areas: 
    "header header"
    "tab1 charts"
    "tab2 charts";
}
.nosidebar {
  height: 100%;
  grid-gap: 12px;
  display: grid;
  grid-template-rows: 64px auto;
  grid-template-areas: 
    "header"
    "charts"
}


.one-chart {
  height: 100%;
}
.two-charts-l1r1 {
  height: 100%;
  grid-gap: 12px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-areas: "c1 c2";
}
.two-charts-t1b1 {
  height: 100%;
  grid-gap: 12px;
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-template-areas:
    "c1"
    "c2";
}
.three-charts-t1b2 {
  height: 100%;
  grid-gap: 12px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-template-areas:
    "c1 c1"
    "c2 c3";
}
.three-charts-t2b1 {
  height: 100%;
  grid-gap: 12px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-template-areas:
    "c1 c2"
    "c3 c3";
}
.three-charts-l1r2 {
  height: 100%;
  grid-gap: 12px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-template-areas:
    "c1 c2"
    "c1 c3";
}
.three-charts-l2r1 {
  height: 100%;
  grid-gap: 12px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-template-areas:
    "c1 c3"
    "c2 c3";
}
.c1 {
  grid-area: c1;
}
.c2 {
  grid-area: c2;
}
.c3 {
  grid-area: c3;
}


.chart-select-tab, .data-set-tab, .c1, .c2, .c3 {
  background-color: #ffffff;
  height: 100%;
  padding: 0.75rem;
  border-radius: 1rem
}

@media (max-aspect-ratio: 1/1) {
  .with-sidebar {
    height: 100%;
    display: grid;
    grid-gap: 12px;
    grid-template-columns: minmax(250px, 1fr) minmax(400px, 2fr);
    grid-template-rows: 64px 30% auto;
    grid-template-areas: 
      "header header"
      "tab1 tab2"
      "charts charts";
  }
}
</style>

