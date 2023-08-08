<template>
  <div class="container h-full p-1">
    <div class="header">
      <p class="wenkai">图表类型</p>
    </div>

    <div class="box" @click="$emit('type-change', 'default')">
      <button class="btn w-16 h-16 p-2">
        默认
      </button>
    </div>
    <div class="box" @click="$emit('type-change', 'bar')">
      <button class="btn w-16 h-16 p-2">
        柱状图
      </button>
    </div>
    <div class="box" @click="$emit('type-change', 'line')">
      <button class="btn w-16 h-16 p-2">
        折线图
      </button>
    </div>
    <div class="box" @click="$emit('type-change', 'scatter')">
      <button class="btn w-16 h-16 p-2">
        散点图
      </button>
    </div>
    <div class="box" @click="$emit('type-change', 'pie')">
      <button class="btn w-16 h-16 p-2">
        饼状图
      </button>
    </div>
    <div class="box" @click="$emit('type-change', 'others')">
      <button class="btn w-16 h-16 p-2">
        其他
      </button>
    </div>
  </div>
</template>


<script>
export default {
  emits: ['type-change'],
  data () {
    return {
      chart_type: "default",
    }
  }
}
</script>


<style scoped>
.container {
  display: grid;
  grid-gap: 4px;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
  grid-template-rows: 32px 1fr 1fr;
  grid-template-areas: 
    "header header header"
    "box box box"
    "box box box";
}
.header {
  grid-area: header;
}
.header, .box {
  height: 100%;
  width: 100%;
}
.box {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
