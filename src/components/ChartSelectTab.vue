<template>
  <div class="flex flex-col h-full p-1">
    <div class="flex items-baseline gap-3">
      <p class="font-wenkai">图表类型</p>
      <p v-if="haveTooltip" class="font-wenkai text-sm">当前视图：{{ chartIndex + 1 }}</p>
    </div>

    <div class="container justify-center items-center">
      <div class="box" v-for="chartType of chartTypes">
        <button 
          class="btn btn-outline border-x-2 border-y-2 square p-2"
          :class="{
            'bg-gray-800 text-white': setting.chartType == chartType
          }"
          @click="$emit('chart-type-change', chartType)" 
          @mouseover="hoveredChartType = chartType"
          @mouseout="hoveredChartType = null">
          <div class="flex flex-col justify-center items-center gap-2 h-full">
            <img :src="'/images/' + chartType + '.svg'" 
              class="relative top-[3%] h-[60%]"
              :class="{
                'icon': setting.chartType == chartType || hoveredChartType == chartType
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
  props: ['setting', 'chartIndex', 'haveTooltip'],
  data() {
    return {
      chartTypes: ['pie', 'bar', 'line', 'scatter', 'map'],
      chartNameMap: {
        "bar": "柱状图",
        "pie": "饼状图",
        "line": "折线图",
        "scatter": "散点图",
        "map": "地图",
      },
      
      hoveredChartType: null,
    }
  },
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
