<template>
  <div class="flex flex-col h-full p-1">
    <p class="wenkai">数据设置</p>
    <div class="flex flex-row h-full overflow-hidden">
      <!-- 左侧选择栏 -->
      <div
        class="flex flex-col flex-none
               w-[80px]
               overflow-y-scroll no-scrollbar"
      >
        <button
          v-for="(tab, index) in tabs"
          :key="index"
          @click="activeTab = index"
          :class="{
            'tab-active': activeTab == index,
          }"
          class="tab tab-bordered h-auto px-1 py-2 leading-5"
        >
          {{ tab }}
        </button>
      </div>
      
      <!-- 右侧设置栏 -->
      <div 
        class="flex-auto flex-col
        w-auto px-4 leading-10 whitespace-nowrap
        overflow-y-scroll"
        v-if="fields.length > 0"
      >
        <!-- 显示字段的基本信息 -->
        <div>
          <p>来自表：{{ fields[activeTab].tableName }}</p>
          <p>字段名称：{{ fields[activeTab].fieldName }}</p>
        </div>

        <!-- 设置不同表的字段之间的关联 -->
        <div class="flex flex-row items-center">
          <p>关联字段：</p>
          <select 
            class="flex select select-bordered select-sm w-full max-w-xs"
            v-model="fields[activeTab].relateTo"
          >
            <option disabled selected>请选择</option>
            <option
              v-for="field of otherFields"
              :key="field"
              :value="field"
            >
              {{ field.fieldName }} - {{ field.tableName }}
            </option>
          </select>
        </div>
        
        <!-- 将字段绑定到图表的维度上 -->
        <div class="flex flex-row items-center">
          <p>绑定到：</p>
          <select 
            class="flex select select-bordered select-sm w-full max-w-xs"
            v-model="fields[activeTab].bindTo"
          >
            <option disabled selected>请选择</option>
            <option
              v-for="bindType of bindTypes"
              :key="bindType"
              :value="bindType"
            >
              {{ bindType }}
            </option>
          </select>
        </div>
        
      </div>
    </div>
  </div>
</template>


<script>
export default {
  props: ['db', 'chartType'],
  data () {
    return {
      tabs: [],
      activeTab: 0,
      
      fields: [],
    }
  },
  watch: {
    db() {
      // 初始化属性
      this.tabs = [];
      this.activeTab = 0;
      this.fields = []

      // 获得所有表名
      var stmt = `SELECT name FROM sqlite_master WHERE type='table'`;
      var result = this.db.exec(stmt);
      const tableNames = result[0].values;

      // 获得所有字段名称
      for (let tableName of tableNames) {
        tableName = tableName[0]
        stmt = `SELECT * FROM [${tableName}]`;
        result = this.db.exec(stmt);
        
        for (let fieldName of result[0].columns) {
          var field = {};
          field["tableName"] = tableName;
          field["fieldName"] = fieldName;
          field["relateTo"] = "请选择";
          field["bindTo"] = "请选择";
          this.fields.push(field)
        }
      }

      // 设置 Tabs 的文本
      for (let field of this.fields) {
        let fieldName = field.fieldName;
        if (this.isChinese(fieldName) && fieldName.length > 10) {
          fieldName = this.truncateString(fieldName, 8);
        } else if (fieldName.length > 11) {
          fieldName = this.truncateString(fieldName, 9);
        }
        this.tabs.push(fieldName)
      }
    },
    fields() {
      this.$emit("set-change", this.fields)
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
  },
  computed: {
    otherFields() {
      let otherFields = [];
      let currentTable = this.fields[this.activeTab].tableName;
      for (let field of this.fields) {
        if (field.tableName != currentTable) {
          otherFields.push(field);
        }
      }
      return otherFields;
    },
    bindTypes() {
      switch (this.chartType) {
        case "scatter":
          return ["横轴", "纵轴", "颜色", "大小"];
        case "line":
          return ["横轴", "纵轴", "颜色"];
        case "bar":
          return ["横轴", "纵轴"];
        default:
          return [];
      }
    },
  }
}
</script>


