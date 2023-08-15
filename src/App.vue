<template>
  <div :class="interface.haveSidebar ? 'with-sidebar' : 'nosidebar'">
    <div class="header">
      <Header
        @component-switch="handleComponentSwitch"
        @layout-change="handleLayoutChange"
        @file-upload="handleDataChange" />
    </div>

    <div v-if="interface.haveSidebar"
      class="chart-select-tab shadow-lg">
      <ChartSelectTab 
        :setting="settings[selectedChartIdx]"
        :chart-index="selectedChartIdx"
        :have-tooltip="interface.haveViewTooltip"
        @chart-type-change="handleChartTypeChange" />
    </div>
    
    <div v-if="interface.haveSidebar"
      class="data-set-tab shadow-lg overflow-y-scroll no-scrollbar">
      <DataSetTab
        :db="db" 
        :setting="settings[selectedChartIdx]"
        :chart-index="selectedChartIdx"
        :chart-num="chartNum"
        :field-num="fieldNum"
        :chart-layout="interface.chartLayout"
        @apply-to-chart="handleChartUpdate" />
    </div>
      
    <div class="charts">
      <div v-if="showCharts" :class="interface.chartLayout">
        <div v-for="i in chartNum" :class="'c' + i + ' shadow-lg'">
          <ChartTab
          :db="db"
          :setting="settings[i - 1]"
          :settings="settings"
          :update="updateCharts[i - 1]"
          @click="selectedChartIdx = i - 1"
          @apply-to-chart="handleChartUpdate" />
        </div>
      </div>
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

  data() {
    return {
      db: null,
      fields: [],
      settings: [
        {
          fields: [],
          chartType: null,
          haveLegend: false,
          methodOfAggregation: null,
        }
      ],
      interface: {
        haveSidebar: true,
        haveViewTooltip: true,
        chartLayout: "one-chart"
      },
      
      chartNum: 1,
      fieldNum: 0,
      selectedChartIdx: 0,
      showCharts: true,
      updateCharts: [true],
    }
  },

  methods: {
    initSettings() {
      this.settings = [];
      this.updateCharts = [];
      for (let i = 0; i < this.chartNum; i++) {
        let setting = {
          chartType: null,
          haveLegend: false,
          methodOfAggregation: 'sum',
          fields: JSON.parse(JSON.stringify(this.fields)),
        };
        this.settings.push(setting);
        this.updateCharts.push(true);
      }
    },
    destroyAllCharts() {
      this.showCharts = false;
      this.$nextTick(() => {
        this.showCharts = true;
      })
    },

    handleComponentSwitch(component) {
      this.interface[component] = !this.interface[component];
    },
    handleLayoutChange(newLayout) {
      this.interface.chartLayout = newLayout;
      this.selectedChartIdx = 0;
      if (newLayout.includes('one')) {
        this.chartNum = 1;
      } else if (newLayout.includes('two')) {
        this.chartNum = 2;
      } else if (newLayout.includes('three')) {
        this.chartNum = 3;
      } else if (newLayout.includes('four')) {
        this.chartNum = 4;
      }
      
      this.initSettings();
      this.destroyAllCharts();
    },
    handleChartUpdate(chartIndex) {
      this.updateCharts[chartIndex] = !this.updateCharts[chartIndex];
    },
    handleChartTypeChange(type) {
      if (type == this.settings[this.selectedChartIdx].chartType) {
        var chartType = null;
      } else {
        var chartType = type;
      }

      this.settings[this.selectedChartIdx] = {
          chartType: chartType,
          haveLegend: false,
          methodOfAggregation: null,
          fields: JSON.parse(JSON.stringify(this.fields)),
      }
    },
    handleDataChange(db) {
      this.db = db;
      let stmt = `SELECT name FROM sqlite_master WHERE type='table'`;
      let results = db.exec(stmt);
      const tableNames = results[0].values;

      this.fields = [];
      for (let tableName of tableNames) {
        tableName = tableName[0]
        stmt = `PRAGMA table_info([${tableName}])`;
        results = db.exec(stmt);
        
        for (let fieldInfo of results[0].values) {
          const field = {
            tableName: tableName,
            fieldName: fieldInfo[1],
            fieldType: fieldInfo[2],
            bindTo: [],
            sendTo: [],
            relateTo: null,
            selectable: [],
          };

          if (field.fieldType != 'REAL') {
            stmt = `SELECT DISTINCT [${field.fieldName}]
                    FROM [${field.tableName}]`
            results = db.exec(stmt);
            for (let row of results[0].values) {
              field.selectable.push(row[0])
            }
          }
          
          if (field.fieldType == 'TEXT') {
            field.fieldType = 'category',
            field.range = [];
          } else {
            field.fieldType = 'value';
            field.range = '';
          }

          this.fields.push(field)
          this.fieldNum++;
        }
      }
      
      this.initSettings();
    },
  },
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
  grid-template-columns: max(300px, 22%) auto;
  grid-template-rows: 64px max(220px, 30%) auto;
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
.four-charts {
  height: 100%;
  grid-gap: 12px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-template-areas:
    "c1 c2"
    "c3 c4";
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
.c4 {
  grid-area: c4;
}


.chart-select-tab, .data-set-tab, .c1, .c2, .c3, .c4 {
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
    grid-template-columns: max(250px, 1fr) max(400px, 2fr);
    grid-template-rows: 64px max(220px, 30%) auto;
    grid-template-areas: 
      "header header"
      "tab1 tab2"
      "charts charts";
  }
}
</style>

