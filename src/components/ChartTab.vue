<template>
  <div ref="chart" style="height: 100%; width: 100%;"></div>
</template>


<script>
import * as echarts from "echarts/core";
import { markRaw } from 'vue'

export default {
  props: ['db', 'setting', 'settings','update'],
  data() {
    return {
      chart: null,
      series: {},
      a: {},

      data: {},
      option: {},
      bindableDims: {
        "pie": ["类目", "角度/半径"],
        "bar": ["横轴", "纵轴", "颜色"],
        "line": ["横轴", "纵轴", "颜色"],
        "scatter": ["横轴", "纵轴", "颜色分类", "颜色渐变", "大小", "形状"],
        "map": ["地区", "颜色深度", "圆圈半径"]
      },

      colors: ['#d3b7d8', '#a13e97', '#632a7e', '280e3b'],
      symbols: ['circle', 'rect', 'line', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'],
      sizeMap: {
        dimension: null,
        text: [],
        controller: {
          inRange: {
            color: []
          },
          outOfRange: {
            color: ['#999']
          }
        },
        left: 'right',
        top: '10%',
        calculable: true,
        inRange: {
          symbolSize: [10, 70]
        },
        outOfRange: {
          symbolSize: [10, 70],
          color: ['rgba(255,255,255,0.4)']
        },
      },
      colorMap: {
        dimension: null,
        text: [],
        controller: {
          inRange: {
            color: []
          },
          outOfRange: {
            color: ['#999']
          }
        },
        left: 'right',
        bottom: '5%',
        calculable: true,
        inRange: {
          colorLightness: [0.9, 0.5]
        },
        outOfRange: {
          color: ['rgba(255,255,255,0.4)']
        },
      },
    }
  },

  mounted() {
    var chart = markRaw(echarts.init(this.$refs.chart));
    
    function resizeChart() {
        chart.resize();
    }
    window.addEventListener("resize", resizeChart);
    resizeChart();
    
    this.chart = chart
    this.chart.setOption({})
  },

  methods: {
    updateChart() {
      console.log(this.bindings);
      var option = {};
      option.tooltip = {};
      option.legend = {}
      option.visualMap = [];
      option.dataset = [];
      option.series = [];
      option.dataZoom = [{type: 'slider'}, {type: 'slider', yAxisIndex: 0}];
      
      const fields = this.getFields(option);
      if (fields == false) {
        return false;
      }
      
      const data = this.getData(fields);
      if (data == false) {
        return false;
      }
      option.dataset.push({source: data});

      this.setSeries(option, fields);
      this.setTooltip(option);
      this.setToolbox(option);
      this.setLegend(option)

      console.log(option)
      this.chart.setOption(option)
    },

    getFields(option) {
      var fields = [];
      var categoryField = this.getCategoryField(option);
      var valueField = this.getValueField(option);
      if (categoryField == null || valueField == null) {
        return false;
      }
      fields.push(categoryField);
      fields.push(valueField);

      if ('颜色' in this.bindings) {
        var colorField = this.setting.fields[this.bindings['颜色']];
        fields.push(colorField)
      }
      if ('颜色分类' in this.bindings) {
        var colorClassField = this.setting.fields[this.bindings['颜色分类']];
        fields.push(colorClassField)
      }
      if ('颜色渐变' in this.bindings) {
        var colorShadingField = this.setting.fields[this.bindings['颜色渐变']];
        fields.push(colorShadingField)
      }
      if ('大小' in this.bindings) {
        var sizeField = this.setting.fields[this.bindings['大小']];
        fields.push(sizeField)
      }
      if ('形状' in this.bindings) {
        var shapeField = this.setting.fields[this.bindings['形状']];
        fields.push(shapeField)
      }

      return fields;
    },
    getCategoryField(option) {
      if ('横轴' in this.bindings) {
        var categoryField = this.setting.fields[this.bindings['横轴']];
        option.xAxis = {
          name: categoryField.fieldName,
        }
        if (categoryField.fieldType != 'REAL') {
          option.xAxis.type = 'category';
        }
      } else if ('类目' in this.bindings) {
        var categoryField = this.setting.fields[this.bindings['类目']];
      } else if ('地区' in this.bindings) {
        var categoryField = this.setting.fields[this.bindings['地区']];
      } else {
        var categoryField = null;
      }
      return categoryField;
    },
    getValueField(option) {
      if ('纵轴' in this.bindings) {
        var valueField = this.setting.fields[this.bindings['纵轴']];
        option.yAxis = {
          "name": valueField.fieldName
        }
      } else if ('角度/半径' in this.bindings) {
        var valueField = this.setting.fields[this.bindings['角度/半径']];
      } else if ('颜色深度' in this.bindings) {
        var valueField = this.setting.fields[this.bindings['颜色深度']];
      } else {
        var valueField = null;
      }
      return valueField;
    },

    getData(fields) {
      var stmt = `SELECT DISTINCT 
                  [${fields[0].tableName}].[${fields[0].fieldName}],
                  [${fields[1].tableName}].[${fields[1].fieldName}] `
      
      for (let i = 2; i < fields.length; i++) {
        stmt += `,[${fields[i].tableName}].[${fields[i].fieldName}] `
      }

      stmt = this.addFromTables(stmt, fields);
      stmt = this.addSelectedConditions(stmt);

      console.log(stmt)
      const results = this.db.exec(stmt);
      var data = results[0].values

      const chartType = this.setting.chartType
      if (chartType != 'scatter') {
        if (chartType == 'pie' || chartType == 'map' || !('颜色' in this.bindings)) {
          data = this.processDataWithTwoFields(data);
        } else {
          data = this.processDataWithThreeFields(data);
        }
      }

      return data;
    },

    addFromTables(stmt, fields){
      var tableNames = [];
      for (let field of fields) {
        if (!(tableNames.includes(field.tableName))) {
          tableNames.push(field.tableName);
        }
      }

      if (tableNames.length == 1) {
        stmt += `FROM [${fields[0].tableName}] `
      } else {
        const relations = this.getRelations(tableNames);
        if (relations.length == 0) {
          console.log('用到不同表的字段时，应该指定表之间关联的字段！')
          return false;
        }
        
        stmt += `FROM [${tableNames[0]}] `
        tableNames.shift()
        while (tableNames.length > 0) {
          stmt += `, [${tableNames[0]}] `
          tableNames.shift()
        }
        
        let field1 = this.setting.fields[relations[0][0]];
        let field2 = this.setting.fields[relations[0][1]];
        stmt += `WHERE [${field1.tableName}].[${field1.fieldName}] = [${field2.tableName}].[${field2.fieldName}] `
        relations.shift()
        while (relations.length > 0) {
          field1 = this.setting.fields[relations[0][0]];
          field2 = this.setting.fields[relations[0][1]];
          stmt += `AND [${field1.tableName}].[${field1.fieldName}] = [${field2.tableName}].[${field2.fieldName}] `
          relations.shift();
        }
      }

      return stmt
    },
    getRelations(tableNames) {
      var relations = [];
      for (let i = 0; i < this.setting.fields.length; i++) {
        let targetIndex = this.setting.fields[i].relateTo;
        if (targetIndex != null &&
        tableNames.includes(this.setting.fields[i].tableName) &&
        tableNames.includes(this.setting.fields[targetIndex].tableName)) {
          relations.push([i, targetIndex])
        }
      }
      return relations;
    },
    addSelectedConditions(stmt){
      for (let field of this.setting.fields) {
        if ('selected' in field && field.selected != null) {
          if (stmt.includes("WHERE")) {
            stmt += `AND [${field.tableName}].[${field.fieldName}] = "${field.selected}"`
          } else {
            stmt += `WHERE [${field.tableName}].[${field.fieldName}] = "${field.selected}"`
          }
        }
      }
      return stmt;
    },
    
    processDataWithTwoFields(data) {
      var values = {}
      for (let row of data) {
        if (row[1] != '') {
          if (!(row[0] in values)) {
            values[row[0]] = [0];
          }
          values[row[0]][0] += row[1];
          values[row[0]].push(row[1]);
        }
      }
      
      var newData = [];
      for (let x in values) {
        if (this.setting.methodOfTakingValue == '总和' ||
        this.setting.methodOfTakingValue == null) {
          newData.push([x, values[x][0]]);
        } else if (this.setting.methodOfTakingValue == '平均值') {
          newData.push([x, values[x][0] / (values[x].length - 1)]);
        }
      }
      return newData;
    },
    processDataWithThreeFields(data) {
      var values = {};
      for (let row of data) {
        if (row[1] != '') {
          if (!(row[0] in values)) {
            values[row[0]] = {};
          }
          if (!(row[2] in values[row[0]])) {
            values[row[0]][row[2]] = [0]
          }
          values[row[0]][row[2]][0] += row[1];
          values[row[0]][row[2]].push(row[1]);
        }
      }
      
      var newData = [];
      for (let dim1 in values) {
        for (let dim2 in values[dim1]) {
          if (this.setting.methodOfTakingValue == '总和' ||
          this.setting.methodOfTakingValue == null) {
            newData.push([dim1, values[dim1][dim2][0], dim2]);
          } else if (this.setting.methodOfTakingValue == '平均值') {
            newData.push([dim1, values[dim1][dim2][0] / (values[dim1][dim2].length - 2), dim2]);
          }
        }
      }
      return newData;
    },

    setSeries(option, fields) {
      var datasetIndex = 1;
      if (fields.length == 2) {
        option.series.push({
          type: this.setting.chartType,
          emphasis: {
            focus: 'self'
          }
        })
      }
      for (let i = 2; i < fields.length; i++) {
        if (fields[i].fieldType != 'REAL') {
          for (let value of fields[i].selectable) {
            option.dataset.push({
              transform: {
                type: 'filter',
                config: {dimension: i, '=': value}
              }
            })
            var series = {
              name: value,
              datasetIndex: datasetIndex,
              type: this.setting.chartType,
              emphasis: {
                focus: 'series'
              }
            }
            if (this.setting.chartType == 'line') {
              series.stack = 'Total';
              series.areaStyle = {};
            }
            option.series.push(series)
            datasetIndex++;
          }

          this.chart.on('mouseover', (params) => {
            var sendTo = fields[i].sendTo
            for (var fieldIndex = 0; fieldIndex < this.setting.fields.length; fieldIndex++) {
              let field = this.setting.fields[fieldIndex]
              if (field.fieldName == sendTo.categoryName && field.tableName == sendTo.tableName) {
                break;
              }
            }
            if (fieldIndex >= this.setting.fields.length) {
              console.log('找不到')
              return;
            }
            this.series.fieldIndex = fieldIndex;
            this.series.seriesName = params.seriesName;
            if ('chartIdx' in fields[i].sendTo) {
              this.series.chartIdx = fields[i].sendTo.chartIdx;
            }
          })
        }
      }
    },
    setToolbox(option) {
      option.brush = {
        toolbox: ['rect', 'polygon', 'lineX', 'lineY', 'keep', 'clear'],
        xAxisIndex: 0
      }
      option.toolbox = {
        feature: {
          magicType: {
            type: ['stack']
          },
          dataView: {}
        }
      }
    },
    setTooltip(option) {
      if (this.setting.chartType == 'bar' || this.setting.chartType == 'line') {
        option.tooltip= {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        }
      }
    },
    setLegend(option) {
      if (this.setting.haveLegend != undefined && this.setting.haveLegend) {
        console.log(this.setting.haveLegend)
        option.legend.show = true;
      } else {
        option.legend.show = false;
      }
    }
  },
  
  computed: {
    bindings() {
      var bindings = {};
      if (this.setting.chartType == undefined) {
        return bindings;
      }
      for (let dimName of this.bindableDims[this.setting.chartType]) {
        for (let i = 0; i < this.setting.fields.length; i++) {
          if (this.setting.fields[i].bindTo == dimName) {
            bindings[dimName] = i;
            break;
          }
        }
      }
      return bindings;
    },
  },

  watch: {
    update() {
      this.updateChart();
    },
    series: {
      handler(newValue) {
        this.settings[newValue.chartIdx].fields[newValue.fieldIndex].selected = newValue.seriesName;
        this.$emit('apply-to-chart');
      },
      deep: true,
    }
  },
};
</script>
  