import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "./assets/tailwind.css";
import "remixicon/fonts/remixicon.css";

//axios
import axios from "axios";
import VueAxios from "vue-axios";

//vue-panzoom
import panZoom from "vue-panzoom";

//click-outside-vue3
import vClickOutside from "click-outside-vue3";

//iView
import ViewUIPlus from "view-ui-plus";
import "view-ui-plus/dist/styles/viewuiplus.css";

//vue3-context-menu
import "@imengyu/vue3-context-menu/lib/vue3-context-menu.css";
import ContextMenu from "@imengyu/vue3-context-menu";

// import ContextMenu from "vue3-contextmenu";
import "vue3-contextmenu/dist/vue3-contextmenu.css";

// Element-plus
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import locale from "element-plus/es/locale/lang/zh-tw";

import jsPlumb from "jsplumb";

const app = createApp(App);
app.use(store);
app.use(router);
app.use(VueAxios, axios);
app.provide("$axios", axios);
app.use(panZoom);
app.use(vClickOutside);
app.use(ViewUIPlus);
app.use(ContextMenu);
app.use(ElementPlus, { locale: locale });
app.provide("$jsPlumb", jsPlumb);
// app.use(contextmenu);
app.mount("#app");
