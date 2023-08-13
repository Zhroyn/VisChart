<template>
  <div class="flex flex-col h-full p-1">
    <p class="font-wenkai">数据设置</p>
    <div class="flex flex-row h-full overflow-hidden">
      <!-- 左侧选择栏 -->
      <div class="flex flex-col flex-none w-[80px]
        overflow-y-scroll no-scrollbar">
        <button
          v-for="(tab, index) in tabs"
          :key="index"
          :class="{
            'tab-active': activeTab == index,
          }"
          @click="activeTab = index"
          class="tab tab-bordered h-auto px-1 py-2 leading-5">
          {{ tab }}
        </button>
      </div>
      
      <!-- 右侧设置栏 -->
      <div v-if="fieldNum > 0"
        class="flex-auto flex-col justify-between w-auto px-4 overflow-y-scroll">
        <div>
          <!-- 显示字段的基本信息 -->
          <div>
            <p class="my-2 break-words">来自表：{{ setting.fields[activeTab].tableName }}</p>
            <p class="my-2 break-words">字段名称：{{ setting.fields[activeTab].fieldName }}</p>
          </div>
          
          <!-- 选择字段的类型 -->
          <div class="flex flex-row items-center my-2">
            <p class="whitespace-nowrap">字段类型：</p>
            <select 
              v-model="setting.fields[activeTab].fieldType"
              class="flex select select-bordered select-sm w-full max-w-xs"
              @click="handleFieldTypeChange">
              <option :value="'category'">类别</option>
              <option :value="'value'">值</option>
            </select>
          </div>
          
          <!-- 将字段绑定到图表的维度上 -->
          <div class="flex flex-row my-2">
            <p class="whitespace-nowrap">绑定到：</p>
            <select 
              v-model="setting.fields[activeTab].bindTo"
              class="h-6 flex select select-bordered select-sm w-full max-w-xs"
              multiple="multiple"
              @click="handleSelectDim">
              <option
                v-for="dimName of bindableDims"
                :value="dimName">
                {{ dimName }}
              </option>
            </select>
          </div>
          
          <!-- 选择将当前字段发送到哪个视图 -->
          <div v-if="chartNum > 1">
            <div class="flex flex-row my-2">
              <p class="whitespace-nowrap">发送到：</p>
              <select 
                v-model="setting.fields[activeTab].sendTo"
                class="flex select select-bordered select-sm w-full max-w-xs"
                multiple="multiple">
                <option
                  v-for="index of otherCharts"
                  :value="index">
                  视图{{ index + 1 }}
                </option>
              </select>
            </div>
          </div>
          
          <!-- 设置字段的取值范围 -->
          <div v-if="setting.fields[activeTab].fieldType == 'category'">
            <div class="flex flex-row my-2">
              <p class="whitespace-nowrap">取值范围：</p>
              <select 
                v-model="setting.fields[activeTab].range"
                class="flex select select-bordered select-sm w-full max-w-xs"
                multiple="multiple">
                <option
                  v-for="value of setting.fields[activeTab].selectable"
                  :value="value">
                  {{ value }}
                </option>
              </select>
            </div>
          </div>
          <div v-if="setting.fields[activeTab].fieldType == 'value'">
            <div class="flex flex-row my-2">
              <p class="whitespace-nowrap">取值范围：</p>
              <input
                type="text"
                placeholder="请输入"
                v-model="setting.fields[activeTab].range"
                class="input input-bordered input-sm w-full max-w-xs ml-2" />
            </div>
          </div>
          
          <!-- 设置不同表的字段的关联 -->
          <div class="flex flex-row items-center my-2">
            <p class="whitespace-nowrap">关联字段：</p>
            <select 
              class="flex select select-bordered select-sm w-full max-w-xs"
              v-model="setting.fields[activeTab].relateTo">
              <option :value="null">请选择</option>
              <option
                v-for="fieldIndex of otherFields"
                :value="fieldIndex">
                {{ setting.fields[fieldIndex].fieldName }} - {{ setting.fields[fieldIndex].tableName }}
              </option>
            </select>
          </div>
          
          <!-- 以下为当前表的通用设置 -->
          <div class="divider m-0"></div>

          <!-- 选择一个类型为 category 字段作为聚合的单位并选择聚合的方法 -->
          <div class="flex flex-row items-center my-2">
            <p class="whitespace-nowrap">聚合方法：</p>
            <div v-if="xFieldIndex == null">
              <select 
                v-model="setting.methodOfAggregation"
                class="flex select select-bordered select-sm w-full max-w-xs">
                <option :value="null">请先进行绑定</option>
              </select>
            </div>
            <div v-else>
              <select 
                v-model="setting.methodOfAggregation"
                class="flex select select-bordered select-sm w-full max-w-xs">
                <template v-if="setting.fields[xFieldIndex].fieldType == 'value'">
                  <option :value="{ method: null }">不聚合</option>
                </template>
                <template v-for="fieldIndex of aggregatableFieldsIndex">
                  <option 
                    :value="{ method: 'sum', fieldIndex: fieldIndex }">
                    以 {{ setting.fields[fieldIndex].fieldName }} - {{ setting.fields[fieldIndex].tableName }} 取总和
                  </option>
                  <option 
                    :value="{ method: 'average', fieldIndex: fieldIndex }">
                    以 {{ setting.fields[fieldIndex].fieldName }} - {{ setting.fields[fieldIndex].tableName }} 取平均值
                  </option>
                </template>
              </select>
            </div>
          </div>
          
          <!-- 设置有无图例 -->
          <div class="flex flex-row items-center my-2">
            <p class="whitespace-nowrap">有无图例：</p>
            <input type="checkbox" v-model="setting.haveLegend" class="checkbox" />
          </div>

        </div>


        <div class="flex justify-end mt-4">
          <button 
            class="btn btn-neutral btn-sm text-white border-x-2 border-y-2" 
            @click="$emit('apply-to-chart', chartIndex)">
            应用
          </button>
        </div>
      </div>
    </div>
  </div>
</template>



<script>
import { inject } from 'vue';

export default {
  props: ['db', 'setting', 'chartIndex', 'chartNum', 'fieldNum', 'chartLayout'],
  data() {
    return {
      activeTab: 0,
      allDims: inject('$allDims'),
    }
  },

  watch: {
    db() {
      this.activeTab = 0;
    },
    xFieldIndex(newValue) {
      if (newValue == null) {
        this.setting.methodOfAggregation = null;
      } else {
        const xField = this.setting.fields[newValue];
        if (xField.fieldType == 'value') {
          this.setting.methodOfAggregation = { method: null };
        } else {
          this.setting.methodOfAggregation = {
            method: 'sum',
            fieldIndex: newValue,
          };
        }
      }
    }
  },

  methods: {
    isChinese(text) {
      const regExp = /[\u4E00-\u9FA5\uF900-\uFA2D]+/;
      return regExp.test(text);
    },
    truncateString(text, maxLength) {
      if (text.length > maxLength) {
        return text.slice(0, maxLength) + "...";
      }
      return text;
    },
    handleFieldTypeChange() {
      if (this.setting.fields[this.activeTab].fieldType == 'category') {
        this.setting.fields[this.activeTab].range = [];
      } else {
        this.setting.fields[this.activeTab].range = '';
      }
    },
    handleSelectDim(event) {
      const selectedDim = event.target.value;
      for (let i = 0; i < this.fieldNum; i++) {
        if (i != this.activeTab 
        && this.setting.fields[i].bindTo.includes(selectedDim)) {
          const index = this.setting.fields[i].bindTo.indexOf(selectedDim);
          this.setting.fields[i].bindTo.splice(index, 1);
        }
      }
    }
  },

  computed: {
    tabs() {
      let tabs = [];
      for (let field of this.setting.fields) {
        let fieldName = field.fieldName;
        if (this.isChinese(fieldName) && fieldName.length > 10) {
          fieldName = this.truncateString(fieldName, 8);
        } else if (fieldName.length > 9) {
          fieldName = this.truncateString(fieldName, 6);
        }
        tabs.push(fieldName)
      }
      return tabs
    },
    tables() {
      let tables = [];
      for (let field of this.setting.fields) {
        if (field.bindTo.length > 0 && !(tables.includes(field.tableName))) {
          tables.push(field.tableName);
        }
      }
      return tables;
    },
    bindableDims() {
      if (this.setting.chartType == null) {
        return [];
      } else {
        let chartType = this.setting.chartType;
        let fieldType = this.setting.fields[this.activeTab].fieldType;
        return this.allDims[chartType][fieldType];
      }
    },
    aggregatableFieldsIndex() {
      let aggregatableFieldsIndex = [];
      if (this.xFieldIndex != null) {
        if (this.setting.fields[this.xFieldIndex].fieldType == 'category') {
          aggregatableFieldsIndex.push(this.xFieldIndex);
        } else {
          for (let i = 0; i < this.fieldNum; i++) {
            const field = this.setting.fields[i];
            if (field.fieldType == 'category' 
            && this.tables.includes(field.tableName)) {
              aggregatableFieldsIndex.push(i);
            }
          }
        }
      }
      return aggregatableFieldsIndex;
    },
    xFieldIndex() {
      if (this.setting.chartType == null) {
        return null;
      }
      let xDimName = this.allDims[this.setting.chartType].x
      for (var i = 0; i < this.fieldNum; i++) {
        if (this.setting.fields[i].bindTo.includes(xDimName)) {
          break;
        }
      }
      if (i < this.fieldNum) {
        return i;
      } else {
        return null;
      }
    },
    otherFields() {
      let otherFields = [];
      let currentTable = this.setting.fields[this.activeTab].tableName;
      for (let i = 0; i < this.fieldNum; i++) {
        if (this.setting.fields[i].tableName != currentTable) {
          otherFields.push(i);
        }
      }
      return otherFields;
    },
    otherCharts() {
      let otherCharts = [];
      for (let i = 0; i < this.chartNum; i++) {
        if (i != this.chartIndex) {
          otherCharts.push(i)
        }
      }
      return otherCharts;
    },
  }
}
</script>


