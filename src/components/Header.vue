<template>
  <div class="navbar bg-base-100 rounded-2xl shadow-lg">
    <div class="flex-none">
      <div class="dropdown dropdown-hover">
        <button tabindex="0" class="btn btn-square btn-ghost">
          <svg xmlns="http://www.w3.org/2000/svg" 
            fill="none"
            viewBox="0 0 24 24"
            class="inline-block w-6 h-6 stroke-current">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
        <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
          <li @click="$emit('component-switch', 'haveSidebar')"><a>隐藏/显示侧边栏</a></li>
          <li @click="$emit('component-switch', 'haveViewTooltip')"><a>关闭/打开视图提醒</a></li>
          <li @click="$emit('layout-change', 'one-chart')"><a>单视图</a></li>
          <li @click="$emit('layout-change', 'two-charts-l1r1')"><a>双视图-左1右1</a></li>
          <li @click="$emit('layout-change', 'two-charts-t1b1')"><a>双视图-上1下1</a></li>
          <li @click="$emit('layout-change', 'three-charts-l1r2')"><a>三视图-左1右2</a></li>
          <li @click="$emit('layout-change', 'three-charts-l2r1')"><a>三视图-左2右1</a></li>
          <li @click="$emit('layout-change', 'three-charts-t1b2')"><a>三视图-上1下2</a></li>
          <li @click="$emit('layout-change', 'three-charts-t2b1')"><a>三视图-上2下1</a></li>
        </ul>
      </div>
    </div>

    <div class="flex-1">
      <a class="btn btn-ghost normal-case text-2xl">VisChart</a>
    </div>

    <div class="flex-none">
      <input type="file" 
        @change="handleFileUpload"
        multiple="multiple"
        accept=".db"
        class="file-input file-input-bordered w-full max-w-xs"
      />
    </div>
  </div>
</template>


<script>
import initSqlJs from "sql.js/dist/sql-wasm.js";
export default {
  methods: {
    handleFileUpload(event) {
      const config = {
        locateFile: filename => `/libs/${filename}`
      }
      
      initSqlJs(config).then((SQL) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          const data = new Uint8Array(reader.result);
          const db = new SQL.Database(data);
          this.$emit("file-upload", db)
        };
        reader.readAsArrayBuffer(file);
      });
    }
  },
}
</script>

