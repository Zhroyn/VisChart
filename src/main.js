import "@/assets/styles/main.css"
import "@/assets/styles/tailwindcss.css"
import * as echarts from "echarts";

import { createApp } from "vue"
import App from "./App.vue"

const app = createApp(App)
const allDims = {
    "pie": {
        category: ["类别"],
        value: ["占比"],
        x: "类别",
        y: "占比",
    },
    "bar": {
        category: ["横轴", "颜色"],
        value: ["横轴", "纵轴"],
        x: "横轴",
        y: "纵轴",
        sep: ["颜色"],
    },
    "line": {
        category: ["横轴", "颜色"],
        value: ["横轴", "纵轴"],
        x: "横轴",
        y: "纵轴",
        sep: ["颜色"],
    },
    "scatter": {
        category: ["颜色", "形状"],
        value: ["横轴", "纵轴", "大小", "颜色渐变"],
        x: "横轴",
        y: "纵轴",
        sep: ["颜色", "形状"],
        map: ["大小", "颜色渐变"],
    },
    "map": {
        category: ["地区"],
        value: ["颜色深度"],
        x: "地区",
        y: "颜色深度",
    }
};

app.provide('$allDims', allDims)
app.mount('#app')
