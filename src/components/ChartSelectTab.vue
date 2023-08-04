<template>
  <div class="container">
    <div class="header">
      <p class="wenkai">图表类型</p>
    </div>
    <div class="box">
      <button class="btn w-16 h-16" 
        @click="$emit('change-type', 'default')"
      >
        默认
      </button>
    </div>
    <div class="box" @click="$emit('change-type', 'bar')">
      <button class="btn w-16 h-16">
        柱状图
      </button>
    </div>
    <div class="box" @click="$emit('change-type', 'line')">
      <button class="btn w-16 h-16">
        折线图
      </button>
    </div>
    <div class="box">
      <button class="btn w-16 h-16">
        Box 4
      </button>
    </div>
    <div class="box">
      <button class="btn w-16 h-16">
        Box 5
      </button>
    </div>
    <div class="box">
      <button class="btn w-16 h-16">
        Box 6
      </button>
    </div>
  </div>
</template>


<script>
export default {
  emits: ['change-type'],
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
  height: 100%;
  /* background: #ddd; */
}
.header {
  grid-area: header;
}
.header, .box {
  height: 100%;
  width: 100%;
  /* background-color: #bbb; */
}
.box {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
