<template>
  <div id="main" style="width:100%; height:100%"></div>
</template>
   
<script>
  // 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
  import * as echarts from "echarts/core";
  // 引入柱状图图表，图表后缀都为 Chart
  // import { BarChart } from "echarts/charts";
  // // 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
  // import {
  //   TitleComponent,
  //   TooltipComponent,
  //   GridComponent,
  //   DatasetComponent,
  //   TransformComponent,
  // } from "echarts/components";
  // // 标签自动布局、全局过渡动画等特性
  // import { LabelLayout, UniversalTransition } from "echarts/features";
  // // 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
  // import { CanvasRenderer } from "echarts/renderers";
  export default {
    // created() {
    //   echarts.use([
    //     TitleComponent,
    //     TooltipComponent,
    //     GridComponent,
    //     DatasetComponent,
    //     TransformComponent,
    //     BarChart,
    //     LabelLayout,
    //     UniversalTransition,
    //     CanvasRenderer,
    //   ]);
    // },
    mounted() {
      var chartDom = document.getElementById("main");
      var myChart = echarts.init(chartDom);
      function resizeChart() {
        myChart.resize();
      }
      window.addEventListener("resize", resizeChart);
      resizeChart();
      let option = {
        legend: {},
        tooltip: {
          trigger: "axis",
          showContent: true,
        },
        dataset: {
          source: [
            ["product", "2012", "2013", "2014", "2015", "2016", "2017"],
            ["Milk Tea", 56.5, 82.1, 88.7, 70.1, 53.4, 85.1],
            ["Matcha Latte", 51.1, 51.4, 55.1, 53.3, 73.8, 68.7],
            ["Cheese Cocoa", 40.1, 62.2, 69.5, 36.4, 45.2, 32.5],
            ["Walnut Brownie", 25.2, 37.1, 41.2, 18, 33.9, 49.1],
          ],
        },
        xAxis: { type: "category" },
        yAxis: { gridIndex: 0 },
        grid: { top: "55%" },
        series: [
          {
            type: "line",
            smooth: true,
            seriesLayoutBy: "row",
            emphasis: { focus: "series" },
          },
          {
            type: "line",
            smooth: true,
            seriesLayoutBy: "row",
            emphasis: { focus: "series" },
          },
          {
            type: "line",
            smooth: true,
            seriesLayoutBy: "row",
            emphasis: { focus: "series" },
          },
          {
            type: "line",
            smooth: true,
            seriesLayoutBy: "row",
            emphasis: { focus: "series" },
          },
          {
            type: "pie",
            id: "pie",
            radius: "30%",
            center: ["50%", "25%"],
            emphasis: {
              focus: "self",
            },
            label: {
              formatter: "{b}: {@2012} ({d}%)",
            },
            encode: {
              itemName: "product",
              value: "2012",
              tooltip: "2012",
            },
          },
        ],
      };
      myChart.on("updateAxisPointer", function (event) {
        const xAxisInfo = event.axesInfo[0];
        if (xAxisInfo) {
          const dimension = xAxisInfo.value + 1;
          myChart.setOption({
            series: {
              id: "pie",
              label: {
                formatter: "{b}: {@[" + dimension + "]} ({d}%)",
              },
              encode: {
                value: dimension,
                tooltip: dimension,
              },
            },
          });
        }
      });
      myChart.setOption(option);
    },
  };
  </script>
   
  <style>
  </style>