import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

import Vue3DraggableResizable from "vue3-draggable-resizable";
//default styles
import "vue3-draggable-resizable/dist/Vue3DraggableResizable.css";

import ClickOutside from "click-outside-vue3"; //點擊範圍外
import panZoom from "vue-panzoom"; //滑鼠滾輪放大縮小

createApp(App)
  .use(store)
  .use(router)
  .use(ElementPlus)
  .use(Vue3DraggableResizable)
  .use(ClickOutside)
  .use(panZoom)
  .mount("#app");
