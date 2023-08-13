<template>
  <div ref="chart" style="height: 100%; width: 100%;"></div>
</template>


<script>
import { inject, markRaw } from 'vue'
import * as echarts from "echarts/core";
import worldJson from '@/assets/json/world.geo.json'

export default {
  emits: ['apply-to-chart'],
  props: ['db', 'setting', 'settings','update'],
  data() {
    return {
      chart: null,
      data: null,
      fields: {},
      data: {},
      option: {},
      allDims: inject('$allDims'),
      sendInfo: {},

      colors: [
        '#2775b6',
        '#c02c38',
        '#57c3c2',
        '#eed045',
        '#7e2065',
        '#475164',
        '#f28e16',
        '#1ba784',
        '#5e5314',
      ],
      symbols: [
        'circle',
        'rect',
        'roundRect',
        'triangle',
        'diamond',
        'pin',
        'arrow'
      ],

      mapNames: {
        '大小': 'size',
        '颜色渐变': 'lightness',
        '颜色深度': 'color',
      },
      sizeMap: {
        dimension: null,
        text: [],
        controller: {
          inRange: {
            color: []
          },
        },
        inRange: {
          symbolSize: [10, 30]
        },
        outOfRange: {
          symbolSize: [10, 30],
          color: ['rgba(255,255,255,0.4)']
        },
        top: 0,
        calculable: true,
      },
      lightnessMap: {
        dimension: null,
        text: [],
        controller: {
          inRange: {
            color: []
          },
        },
        inRange: {
          colorLightness: [0.9, 0.5]
        },
        outOfRange: {
          color: ['rgba(255,255,255,0.4)']
        },
        calculable: true,
      },
      colorMap: {
        dimension: null,
        text: [],
        inRange: {
          color: ['rgba(255, 255, 255, 0.4)']
        },
        calculable: true,
      },
    }
  },

  mounted() {
    this.creatChart();
    this.chart.setOption({});
    echarts.registerMap('worldMap', worldJson)
  },
  
  methods: {
    creatChart() {
      var chart = markRaw(echarts.init(this.$refs.chart));

      function resizeChart() {
        chart.resize();
      }
      window.addEventListener("resize", resizeChart);
      resizeChart();

      this.chart = chart
    },

    updateChart() {      
      console.log("数据绑定为", this.bindings);
      var option = {};
      option.tooltip = {};
      option.legend = {}
      option.visualMap = [];
      option.dataset = [];
      option.series = [];
      
      const fields = this.getFields();
      if (fields == false) {
        return false;
      }
      const data = this.getData();
      if (data == false) {
        return false;
      }
      option.dataset.push({source: data});

      this.chart.dispose();
      this.creatChart()

      this.setAxis(option);
      this.setSeries(option);
      this.setVisualMap(option);
      this.setTooltip(option);
      this.setToolbox(option);
      this.setLegend(option);
      this.setDataZoom(option);

      this.addSendEvent();

      console.log("图表设置为", option);
      this.chart.setOption(option);
    },

    getFields() {
      const chartType = this.setting.chartType;
      if (chartType == null) {
        return false;
      }
      let fields = {};
      let dimIndex = 0;

      for (let dim of ['x', 'y']) {
        if (this.allDims[chartType][dim] in this.bindings) {
          fields[dim] = {
            fieldIndex: this.bindings[this.allDims[chartType][dim]],
            dimIndex: dimIndex++,
          };
        }
      }
      if (!('x' in fields) || !('y' in fields)) {
        return false;
      }

      for (let dim of ['sep', 'map']) {
        if (dim in this.allDims[chartType]) {
          for (let dimName of this.allDims[chartType][dim]) {
            if (dimName in this.bindings) {
              if (!(dim in fields)) {
                fields[dim] = {};
              }
              fields[dim][dimName] = {
                fieldIndex: this.bindings[dimName],
                dimIndex: dimIndex++,
              };
            }
          }
        }
      }

      if (this.setting.methodOfAggregation != null
      && this.setting.methodOfAggregation.method != null) {
        fields.aggregation = {
          fieldIndex: this.setting.methodOfAggregation.fieldIndex,
          dimIndex: dimIndex++,
        };
      }

      console.log(fields)
      this.fields = fields;
      return fields;
    },

    getData() {
      var stmt = "SELECT DISTINCT "
      stmt = this.addFieldNames(stmt);
      stmt = this.addFromTables(stmt);
      if (stmt == false) {
        return false
      }
      stmt = this.addConditions(stmt);

      console.log("数据库查询语句为", stmt)
      const results = this.db.exec(stmt);
      var data = results[0].values

      data = this.aggregateData(data);
      this.data = data;
      return data;
    },
    
    addFieldNames(stmt) {
      const field = this.setting.fields[this.fieldsIndex[0]];
      stmt += `[${field.tableName}].[${field.fieldName}] `;
      for (let i = 1; i < this.fieldsIndex.length; i++) {
        const field = this.setting.fields[this.fieldsIndex[i]];
        stmt += `, [${field.tableName}].[${field.fieldName}] `;
      }
      return stmt;
    },
    addFromTables(stmt){
      if (this.tables.length == 1) {
        stmt += `FROM [${this.setting.fields[this.fields.x.fieldIndex].tableName}] `
      } else {
        if (this.relations.length == 0) {
          console.log('用到不同表的字段时，应该指定表之间的字段的关联！')
          return false;
        }
        
        stmt += `FROM [${this.tables[0]}] `
        for (let i = 1; i < this.tables.length; i++) {
          stmt += `, [${this.tables[i]}] `
        }
        
        let f1 = this.setting.fields[this.relations[0][0]];
        let f2 = this.setting.fields[this.relations[0][1]];
        stmt += `WHERE [${f1.tableName}].[${f1.fieldName}] = [${f2.tableName}].[${f2.fieldName}] `
        for (let i = 1; i < this.relations.length; i++) {
          f1 = this.setting.fields[this.relations[i][0]];
          f2 = this.setting.fields[this.relations[i][1]];
          stmt += `AND [${f1.tableName}].[${f1.fieldName}] = [${f2.tableName}].[${f2.fieldName}] `
        }
      }

      return stmt
    },
    addConditions(stmt){
      const xField = this.setting.fields[this.fields.x.fieldIndex];
      const yField = this.setting.fields[this.fields.y.fieldIndex];
      stmt += stmt.includes("WHERE") ? "AND " : "WHERE ";
      stmt += `[${xField.tableName}].[${xField.fieldName}] != "" `
      stmt += `AND [${yField.tableName}].[${yField.fieldName}] != "" `
      
      for (let field of this.setting.fields) {
        if (this.tables.includes(field.tableName)) {
          if (field.fieldType == 'category' && field.range.length > 0) {
            stmt += `AND [${field.tableName}].[${field.fieldName}] IN ("${field.range[0]}"`
            for (let i = 1; i < field.range.length; i++) {
              stmt += `,"${field.range[i]}"`
            }
            stmt += ") "
          } else if (field.fieldType == 'value' && field.range != '') {
            const conditions = field.range.split(",");
            stmt += `AND [${field.tableName}].[${field.fieldName}] ${conditions[0]} `
            for (let i = 1; i < conditions.length; i++) {
              stmt += `AND [${field.tableName}].[${field.fieldName}] ${conditions[i]} `
            }
          }
        }
      }
      return stmt;
    },
    
    aggregateData(data) {
      if (this.setting.methodOfAggregation.method == null) {
        return data;
      }

      const xFieldType = this.setting.fields[this.fields.x.fieldIndex].fieldType;
      let sums = {};
      let counts = {};
      for (let row of data) {
        const key = JSON.stringify(row.slice(2));
        const value = row.slice(0, 2);
        if (!(key in sums)) {
          sums[key] = value;
          counts[key] = 1;
        } else {
          if (xFieldType == 'value') {
            sums[key][0] += value[0];
          }
          sums[key][1] += value[1];
          counts[key]++;
        }
      }

      let newData = [];
      for (let key in sums) {
        let row = sums[key].concat(JSON.parse(key));
        if (this.setting.methodOfAggregation.method == 'average') {
          if (xFieldType == 'value') {
            row[0] /= counts[key];
          }
          row[1] /= counts[key];
        }
        newData.push(row);
      }
      return newData;
    },

    setAxis(option) {
      switch (this.setting.chartType) {
        case 'bar':
        case 'line':
        case 'scatter':
          for (let dim of ['x', 'y']) {
            const field = this.setting.fields[this.fields[dim].fieldIndex];
            option[dim + "Axis"] = {
              name: field.fieldName,
              type: field.fieldType,
            }
          }
          break;
      }
    },
    setSeries(option) {
      if ('sep' in this.fields) {
        let datasetIndex = 1;
        for (let dimName in this.fields.sep) {
          const fieldIndex = this.fields.sep[dimName].fieldIndex;
          const dimIndex = this.fields.sep[dimName].dimIndex;
          const chartType = this.setting.chartType;
          let i = 0;
          for (let value of this.setting.fields[fieldIndex].selectable) {
            option.dataset.push({
              transform: {
                type: 'filter',
                config: { dimension: dimIndex, '=': value }
              }
            });
            var series = {
              name: value,
              type: chartType,
              datasetIndex: datasetIndex++,
              emphasis: {
                focus: 'series'
              }
            }
            if (dimName == '形状') {
              series.symbol = this.symbols[i++ % this.symbols.length]
            }
            if (chartType == 'line' || chartType == 'bar') {
              series.stack = 'Total';
              series.areaStyle = {};
            }
            option.series.push(series);
          }
        }
      } else {
        var series = {
          type: this.setting.chartType,
          emphasis: {
            focus: 'self'
          }
        };
        if (this.setting.chartType == 'map') {
          series.name = this.setting.fields[this.fields.y.fieldIndex].fieldName;
          series.roam = true;
          series.map = 'worldMap';
        }
        option.series.push(series)
      }
    },
    setVisualMap(option) {
      if (this.setting.chartType == 'map') {
        const field = this.setting.fields[this.fields.y.fieldIndex];
        this.colorMap.dimension = 1;
        this.colorMap.text.push(field.fieldName);
        this.colorMap.inRange.color.push(this.colors[0]);
        this.colorMap.max = this.getMax(1);
        this.colorMap.min = this.getMin(1);
        option.visualMap.push(this.colorMap);
      }
      if ('map' in this.fields) {
        let i = 0;
        for (let dimName in this.fields.map) {
          const fieldIndex = this.fields.map[dimName].fieldIndex;
          const dimIndex = this.fields.map[dimName].dimIndex;
          const field = this.setting.fields[fieldIndex];
          this[this.mapNames[dimName] + 'Map'].dimension = dimIndex;
          this[this.mapNames[dimName] + 'Map'].text.push(field.fieldName);

          const color = this.colors[i++ % this.colors.length];
          this[this.mapNames[dimName] + 'Map'].controller.inRange.color = color;
          this[this.mapNames[dimName] + 'Map'].max = this.getMax(dimIndex);
          this[this.mapNames[dimName] + 'Map'].min = this.getMin(dimIndex);

          option.visualMap.push(this[this.mapNames[dimName] + 'Map']);
        }
      }
    },
    getMax(dimIndex) {
      let max = this.data[0][dimIndex];
      for (let i = 1; i < this.data.length; i++) {
        if (this.data[i][dimIndex] > max) {
          max = this.data[i][dimIndex];
        }
      }
      return max;
    },
    getMin(dimIndex) {
      let min = this.data[0][dimIndex];
      for (let i = 1; i < this.data.length; i++) {
        if (this.data[i][dimIndex] < min) {
          min = this.data[i][dimIndex];
        }
      }
      return min;
    },

    setToolbox(option) {
      option.brush = {
        toolbox: ['rect', 'polygon', 'lineX', 'lineY', 'keep', 'clear'],
        xAxisIndex: 0
      };
      option.toolbox = {
        feature: {
          dataView: {}
        }
      };
      if (this.setting.chartType == 'bar') {
        option.toolbox.feature.magicType = { type: ['stack'] }
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
        option.legend.show = true;
      } else {
        option.legend.show = false;
      }
    },
    setDataZoom(option) {
      switch (this.setting.chartType) {
        case 'bar':
        case 'line':
        case 'scatter':
          option.dataZoom = [
            {type: 'slider'}, 
            {type: 'slider', yAxisIndex: 0}
          ];
          break;
      }
    },

    addSendEvent() {
      const xField = this.setting.fields[this.fields.x.fieldIndex];
      if (xField.fieldType == 'value' && !('sep' in this.fields)) {
        return;
      } else if (xField.fieldType == 'category') {
        const dimIndex = this.fields.x.dimIndex;
        this.sendInfo.fieldIndex = this.fields.x.fieldIndex;
        this.chart.on('mouseover', (event) => {
          this.sendInfo.value = event.value[dimIndex];
        })
      } else if (Object.keys(this.fields.sep).length == 1) {
        const dimName = Object.keys(this.fields.sep)[0];
        const dimIndex = this.fields.sep[dimName].dimIndex;
        this.sendInfo.fieldIndex = this.fields.sep[dimName].fieldIndex;
        this.chart.on('mouseover', (event) => {
          this.sendInfo.value = event.value[dimIndex];
        })
      }
      
    }
  },
  
  computed: {
    bindings() {
      let bindings = {};
      if (this.setting.chartType == null) {
        return bindings;
      }
      for (let i = 0; i < this.setting.fields.length; i++) {
        for (let dimName of this.setting.fields[i].bindTo) {
          bindings[dimName] = i;
        }
      }
      return bindings;
    },
    fieldsIndex() {
      let fieldsIndex = [
        this.fields.x.fieldIndex,
        this.fields.y.fieldIndex
      ];
  
      for (let dim of ['sep', 'map']) {
        if (dim in this.fields) {
          for (let dimName in this.fields[dim]) {
            fieldsIndex.push(this.fields[dim][dimName].fieldIndex);
          }
        }
      }
  
      if ('aggregation' in this.fields) {
        fieldsIndex.push(this.fields.aggregation.fieldIndex);
      }
  
      return fieldsIndex;
    },
    tables() {
      let tables = [];
      for (let index of this.fieldsIndex) {
        const tableName = this.setting.fields[index].tableName;
        if (!(tables.includes(tableName))) {
          tables.push(tableName)
        }
      }
      return tables
    },
    relations() {
      let relations = [];
      for (let i = 0; i < this.setting.fields.length; i++) {
        let targetIndex = this.setting.fields[i].relateTo;
        if (targetIndex != null &&
        this.tables.includes(this.setting.fields[i].tableName) &&
        this.tables.includes(this.setting.fields[targetIndex].tableName)) {
          relations.push([i, targetIndex])
        }
      }
      return relations;
    },
  },

  watch: {
    update() {
      this.updateChart();
    },
    'sendInfo.value'() {
      const fieldIndex = this.sendInfo.fieldIndex;
      const field = this.setting.fields[fieldIndex];

      let relatedFieldsIndex = [fieldIndex];
      for (let i = 0; i < this.setting.fields.length; i++) {
        const targetIndex = this.setting.fields[i].relateTo;
        if (targetIndex != null) {
          if (relatedFieldsIndex.includes(i)) {
            relatedFieldsIndex.push(targetIndex)
          }
          if (relatedFieldsIndex.includes(targetIndex)) {
            relatedFieldsIndex.push(i);
          }
        }
      }

      for (let chartIndex of field.sendTo) {
        for (let i of relatedFieldsIndex) {
          this.settings[chartIndex].fields[i].range = [this.sendInfo.value];
        }
        this.$emit('apply-to-chart', chartIndex);
      }
    }
  },
};
</script>
  