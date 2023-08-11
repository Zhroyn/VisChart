<template>
  <div id="BarChart" style="height: 100%; width: 100%;"></div>
</template>
   
<script>
import * as echarts from "echarts/core";
export default {
  mounted() {
    var chartDom = document.getElementById('BarChart');
    var myChart = echarts.init(chartDom);
    var option;

    function resizeChart() {
      myChart.resize();
    }
    window.addEventListener("resize", resizeChart);
    resizeChart();

    let xAxisData = [];
    let data1 = [];
    let data2 = [];
    let data3 = [];
    let data4 = [];
    for (let i = 0; i < 10; i++) {
      xAxisData.push('Class' + i);
      data1.push(+(Math.random() * 2).toFixed(2));
      data2.push(+(Math.random() * 5).toFixed(2));
      data3.push(+(Math.random() + 0.3).toFixed(2));
      data4.push(+Math.random().toFixed(2));
    }
    var emphasisStyle = {
      itemStyle: {
        shadowBlur: 10,
        shadowColor: 'rgba(0,0,0,0.3)'
      }
    };
    option = {
      legend: {
        data: ['bar', 'bar2', 'bar3', 'bar4'],
        left: '10%'
      },
      brush: {
        toolbox: ['rect', 'polygon', 'lineX', 'lineY', 'keep', 'clear'],
        xAxisIndex: 0
      },
      toolbox: {
        feature: {
          magicType: {
            type: ['stack']
          },
          dataView: {}
        }
      },
      tooltip: {},
      xAxis: {
        data: xAxisData,
        name: 'X Axis',
        axisLine: { onZero: true },
        splitLine: { show: false },
        splitArea: { show: false }
      },
      yAxis: {},
      grid: {
        bottom: 100
      },
      series: [
        {
          name: 'bar',
          type: 'bar',
          stack: 'one',
          emphasis: emphasisStyle,
          data: data1
        },
        {
          name: 'bar2',
          type: 'bar',
          stack: 'one',
          emphasis: emphasisStyle,
          data: data2
        },
        {
          name: 'bar3',
          type: 'bar',
          stack: 'two',
          emphasis: emphasisStyle,
          data: data3
        },
        {
          name: 'bar4',
          type: 'bar',
          stack: 'two',
          emphasis: emphasisStyle,
          data: data4
        }
      ],
      dataZoom:[
        {
            type: 'slider',//slider表示有滑动块的，inside表示内置的
            show: true,
            xAxisIndex: [0],
            start: 0,
            end: 100
        }
      ],
    };
    myChart.on('brushSelected', function (params) {
      var brushed = [];
      var brushComponent = params.batch[0];
      for (var sIdx = 0; sIdx < brushComteponent.selected.length; sIdx++) {
        var rawIndices = brushComponent.selecd[sIdx].dataIndex;
        brushed.push('[Series ' + sIdx + '] ' + rawIndices.join(', '));
      }
      myChart.setOption({
        title: {
          backgroundColor: '#333',
          text: 'SELECTED DATA INDICES: \n' + brushed.join('\n'),
          bottom: 0,
          right: '10%',
          width: 100,
          textStyle: {
            fontSize: 12,
            color: '#fff'
          }
        }
      });
    });
    option && myChart.setOption(option);
  }
}
</script>

  