<template>
  <div class="flex flex-col h-full p-1">
    <div class="flex items-baseline gap-3">
      <p class="wenkai">图表类型</p>
      <p v-if="haveTooltip" class="wenkai text-sm">当前视图：{{ chartIdx + 1 }}</p>
    </div>

    <div class="container justify-center items-center">
      <div class="box" v-for="chartType of chartTypes">
        <button 
          class="btn btn-outline border-x-2 border-y-2 square p-2"
          :class="{
            'bg-gray-800 text-white': selectedChartType == chartType
          }"
          @click="handleTypeChange(chartType)" 
          @mouseover="hoveredChartType=chartType"
          @mouseout="hoveredChartType=null">
          <div class="flex flex-col justify-center items-center gap-2 h-full">
            <img :src="'/icons/' + chartType + '.svg'" 
              class="relative top-[3%] h-[60%]"
              :class="{
                'icon': selectedChartType == chartType || hoveredChartType == chartType
              }">
            <p class="relative bottom-[0%] font-bold">{{ chartNameMap[chartType] }}</p>
          </div>
        </button>
      </div>

    </div>
  </div>
</template>


<script>
export default {
  props: ['setting', 'chartIdx', 'haveTooltip'],
  data () {
    return {
      chartTypes: ['pie', 'bar', 'line', 'scatter', 'map'],
      chartNameMap: {
        "bar": "柱状图",
        "pie": "饼状图",
        "line": "折线图",
        "scatter": "散点图",
        "map": "地图",
      },
      bindableDims: {
        "pie": ["类目", "角度/半径"],
        "bar": ["横轴", "纵轴", "颜色"],
        "line": ["横轴", "纵轴", "颜色"],
        "scatter": ["横轴", "纵轴", "颜色分类", "颜色渐变", "大小", "形状"],
        "map": ["地区", "颜色深度", "圆圈半径"]
      },

      hoveredChartType: null,
    }
  },
  computed: {
    selectedChartType() {
      if ('chartType' in this.setting) {
        return this.setting.chartType;
      } else {
        return null;
      }
    }
  },
  methods: {
    handleTypeChange(type) {
      if ('chartType' in this.setting && 
      this.setting.chartType == type) {
        this.setting.chartType = null;
      } else {
        this.setting.chartType = type;
      }
    },
  }
}
</script>


<style scoped>
.container {
  display: grid;
  grid-gap: 4px;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: minmax(0, 1fr) minmax(0, 1fr);
  height: 100%;
}
.box {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}
.square {
  width: clamp(64px, 75%, 96px);
  height: auto;
  aspect-ratio: 1/1
}
.icon{
  position: relative;
  transform: translateX(-10000px);
  filter: drop-shadow(#eee 10000px 0);     
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
}
</style>
