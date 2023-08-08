<template>
  <div class="navbar bg-base-100 rounded-2xl shadow-lg">
    <div class="flex-none">
      <button class="btn btn-square btn-ghost">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
      </button>
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
  data () {
    return {
      db: null,
    }
  },
  methods: {
    handleFileUpload(event) {
      const config = {
        locateFile: filename => `/node_modules/sql.js/dist/${filename}`
      }
      
      initSqlJs(config).then((SQL) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          const data = new Uint8Array(reader.result);
          this.db = new SQL.Database(data);
        };
        reader.readAsArrayBuffer(file);
      });
    }
  },
  watch: {
    db() {
      this.$emit("file-upload", this.db)
    }
  }
}
</script>

