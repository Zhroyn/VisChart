<template>
  <div class="flex flex-col h-full p-1">
    <p class="wenkai">数据设置</p>
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
      <div
        v-if="setting.fields.length > 0"
        class="flex-auto flex-col justify-between w-auto px-4 overflow-y-scroll">
        <div>
          <!-- 显示字段的基本信息 -->
          <div>
            <p class="my-2 break-words">来自表：{{ setting.fields[activeTab].tableName }}</p>
            <p class="my-2 break-words">字段名称：{{ setting.fields[activeTab].fieldName }}</p>
          </div>
  
          <!-- 将字段绑定到图表的维度上 -->
          <div class="flex flex-row items-center my-2">
            <p class="whitespace-nowrap">绑定到：</p>
            <select 
              v-model="setting.fields[activeTab].bindTo"
              class="flex select select-bordered select-sm w-full max-w-xs"
              @click="handleSelectDim">
              <option :value="null">请选择</option>
              <option
                v-for="dimName of bindableDims[setting.chartType]"
                :value="dimName">
                {{ dimName }}
              </option>
            </select>
          </div>
  
          <!-- 设置不同表的字段之间的关联 -->
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
          
          <!-- 当字段为类目时可以设置 -->
          <div v-if="setting.fields[activeTab].fieldType != 'REAL'">
            <div class="divider m-0"></div>
            <div class="flex flex-row items-center my-2">
              <p class="whitespace-nowrap">取值范围：</p>
              <select 
                v-model="setting.fields[activeTab].selected"
                class="flex select select-bordered select-sm w-full max-w-xs">
                <option :value="null">全选</option>
                <option
                  v-for="value of setting.fields[activeTab].selectable"
                  :value="value">
                  {{ value }}
                </option>
              </select>
            </div>

            <div class="flex flex-row items-center my-2">
              <p class="whitespace-nowrap">取值方法：</p>
              <select 
                v-model="setting.methodOfTakingValue"
                class="flex select select-bordered select-sm w-full max-w-xs">
                <option :value="undefined">请选择</option>
                <option
                  v-for="method of ['总和', '平均值']"
                  :value="method">
                  {{ method }}
                </option>
              </select>
            </div>

            <div class="flex flex-row items-center my-2">
              <p class="whitespace-nowrap">发送到：</p>
              <select 
                v-model="setting.fields[activeTab].sendTo"
                class="flex select select-bordered select-sm w-full max-w-xs">
                <option :value="null">请选择</option>
                <option
                  v-for="category of otherCategories"
                  :value="category">
                  视图{{ category.chartIdx + 1 }} - {{ category.categoryName }} - {{ category.tableName }}
                </option>
              </select>
            </div>

            <div class="flex flex-row items-center my-2">
              <p class="whitespace-nowrap">有无图例：</p>
              <input type="checkbox" v-model="setting.haveLegend" class="checkbox" />
            </div>
          </div>

        </div>


        <div class="flex justify-end mt-4">
          <button 
            class="btn btn-neutral btn-sm text-white border-x-2 border-y-2" 
            @click="$emit('apply-to-chart')">
            应用
          </button>
        </div>
      </div>
      <!-- <button class="btn" @click="console.log(setting)">1</button> -->
    </div>
  </div>
</template>



<script>
export default {
  props: ['db', 'setting', 'chartIdx', 'chartLayout'],
  data() {
    return {
      options: [1, 2, 3],
      activeTab: 0,
      
      bindableDims: {
        "pie": ["类目", "角度/半径"],
        "bar": ["横轴", "纵轴", "颜色"],
        "line": ["横轴", "纵轴", "颜色"],
        "scatter": ["横轴", "纵轴", "颜色分类", "颜色渐变", "大小", "形状"],
        "map": ["地区", "颜色深度", "圆圈半径"]
      },
      chartNameMap: {
        "bar": "柱状图",
        "pie": "饼状图",
        "line": "折线图",
        "scatter": "散点图",
        "map": "地图"
      },
    }
  },

  watch: {
    db() {
      this.activeTab = 0;
    },
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
    handleSelectDim(event) {
      const selectedDim = event.target.value;
      for (let i = 0; i < this.setting.fields.length; i++) {
        if (i != this.activeTab &&
        this.setting.fields[i].bindTo == selectedDim) {
          this.setting.fields[i].bindTo = null;
        }
      }
    }
  },

  computed: {
    tabs() {
      var tabs = [];
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
    categories() {
      let categories = [];
      for (let field of this.setting.fields) {
        if (field.fieldType != 'REAL') {
          let category = {};
          category.categoryName = field.fieldName;
          category.tableName = field.tableName;
          categories.push(category)
        }
      }
      return categories;
    },
    otherFields() {
      let otherFields = [];
      let currentTable = this.setting.fields[this.activeTab].tableName;
      for (let i = 0; i < this.setting.fields.length; i++) {
        if (this.setting.fields[i].tableName != currentTable) {
          otherFields.push(i);
        }
      }
      return otherFields;
    },
    otherCategories() {
      let otherCategories = [];
      let chartNum = (this.chartLayout.includes("one")) ? 1 : 
                     (this.chartLayout.includes("two") ? 2 : 3);
      for (let i = 0; i < chartNum; i++) {
        if (i != this.chartIdx) {
          for (let category of this.categories) {
            let otherCategory = {}
            otherCategory.chartIdx = i;
            otherCategory.categoryName = category.categoryName;
            otherCategory.tableName = category.tableName;
            otherCategories.push(otherCategory)
          }
        }
      }
      return otherCategories;
    }
  }
}
</script>


