<template>
  <div class="flex items-center justify-center space-x-4 p-4">
    <router-link to="/"><el-button type="primary" plain>返回列表</el-button></router-link>
    <router-link to="/addPage"><el-button type="primary">編輯</el-button></router-link>
  </div>

  <div class="flow_region">
    <div id="flowWrap" ref="flowWrap" class="flow-wrap" @drop="drop($event)" @dragover="allowDrop($event)">
      <div id="flow">
        <div
          v-show="auxiliaryLine.isShowXLine"
          class="auxiliary-line-x"
          :style="{
            width: auxiliaryLinePos.width,
            top: auxiliaryLinePos.y + 'px',
            left: auxiliaryLinePos.offsetX + 'px',
          }"
        ></div>
        <div
          v-show="auxiliaryLine.isShowYLine"
          class="auxiliary-line-y"
          :style="{
            height: auxiliaryLinePos.height,
            left: auxiliaryLinePos.x + 'px',
            top: auxiliaryLinePos.offsetY + 'px',
          }"
        ></div>
        <flowNode
          v-for="item in data.nodeList"
          :id="item.id"
          :key="item.id"
          :node="item"
          :edit="editType"
          @setNodeName="setNodeName"
          @deleteNode="deleteNode"
          @changeLineState="changeLineState"
          @dblclick.prevent="openSide(item)"
        ></flowNode>
      </div>
    </div>

    <div class="sideMenu absolute top-0 right-0 flex h-screen w-80 flex-col bg-white p-5 shadow-xl" :class="{ sideContent: showContent }">
      <div class="h-10 w-10 cursor-pointer rounded-full" @click="showContent = false">
        <i class="ri-close-circle-fill text-2xl"></i>
      </div>
      <div class="p-4">
        <div class="flex">
          <p class="w-20 text-left">設備名稱：</p>
          <p>{{ from.nodeName }}</p>
        </div>

        <div class="flex">
          <p class="w-20 text-left">設備ID：</p>
          <p>{{ from.id }}</p>
        </div>

        <div class="flex flex-col" v-show="from.img">
          <p class="w-20 text-left">設備圖片：</p>
          <img :src="from.img" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { jsPlumb } from "jsplumb";
import { jsplumbSetting, jsplumbConnectOptions, jsplumbSourceOptions, jsplumbTargetOptions } from "./config/commonConfig";
import methods from "./config/methods";
import flowNode from "./components/node-item";
import { nodeList, patchLineList } from "./config/api.js";
import { GenNonDuplicateID } from "@/common/until";
export default {
  name: "FlowEdit",
  components: {
    flowNode,
  },
  data() {
    return {
      editStatus: false, //判斷是否為編輯狀態
      showContent: false, //右側詳細視窗
      from: {}, //右側詳細內容
      jsPlumb: null,
      data: {
        nodeList: [],
        lineList: [],
      },
      jsplumbSetting: jsplumbSetting,
      jsplumbConnectOptions: jsplumbConnectOptions,
      jsplumbSourceOptions: jsplumbSourceOptions,
      jsplumbTargetOptions: jsplumbTargetOptions,
      auxiliaryLine: { isShowXLine: false, isShowYLine: false }, //對齊輔助線預設不顯示
      auxiliaryLinePos: {
        width: "100%",
        height: "100%",
        offsetX: 0,
        offsetY: 0,
        x: 20,
        y: 20,
      },
      commonGrid: [5, 5], //節點移動最小距離
    };
  },
  mounted() {
    this.jsPlumb = jsPlumb.getInstance();
    this.getInfo();
    this.$nextTick(() => {
      this.init();
    });
  },
  created() {},
  methods: {
    ...methods,
    getInfo() {
      if (this.$route.query && this.$route.query.res) {
        let data = JSON.parse(this.$route.query.res);
        this.data = Object.assign({}, data);
        this.editStatus = JSON.parse(this.$route.query.editStatus);
      } else {
        this.data = {};
      }
    },
    getApi() {
      /*lineList().then((res) => {
        this.data.lineList = res.data;
        console.log("axios線條", this.data.lineList);
      });*/
      nodeList().then((res) => {
        this.data.nodeList = res.data;
      });
    },

    openSide(item) {
      this.showContent = true;
      this.from = item;
    },

    //開啟編輯狀態
    editChang() {
      this.editType = true;
    },

    init() {
      this.jsPlumb.ready(() => {
        // 導入默認配置
        this.jsPlumb.importDefaults(this.jsplumbSetting);
        //完成連線前的檢查
        this.jsPlumb.bind("beforeDrop", (evt) => {
          console.log(evt, 123);
          let res = () => {}; //此處可以加入是否加入添加連線的檢查， 返回 false 則不增加；
          return res;
        });
        // 新增連線成功後，維護本地數據
        this.jsPlumb.bind("connection", (evt) => {
          this.addLine(evt);
        });
        //連線點擊兩下刪除
        this.jsPlumb.bind("dblclick", (conn, originalEvent) => {
          console.log(originalEvent);
          this.confirmDelLine(conn);
        });
        //斷開連線後，維護本地數據
        this.jsPlumb.bind("connectionDetached", (evt) => {
          this.deleLine(evt);
        });
        this.loadEasyFlow();
        // 讓jsPlumb立刻重整。
        this.jsPlumb.setSuspendDrawing(false, true);
      });
      this.initPanZoom();
    },
    // 載入流程圖
    loadEasyFlow() {
      //載入連線api

      // 節點初始化
      for (let i = 0; i < this.data.nodeList.length; i++) {
        let node = this.data.nodeList[i];
        // 设置源点，可以拖出线连接其他节点
        this.jsPlumb.makeSource(node.id, this.jsplumbSourceOptions);
        // // 设置目标点，其他源点拖出的线可以连接该节点
        this.jsPlumb.makeTarget(node.id, this.jsplumbTargetOptions);
        // this.jsPlumb.draggable(node.id);
        this.draggableNode(node.id);
      }

      // 連線初始化
      this.jsPlumb.unbind("connection"); //取消連線事件
      for (let i = 0; i < this.data.lineList.length; i++) {
        let line = this.data.lineList[i];
        const conn = this.jsPlumb.connect(
          {
            source: line.from,
            target: line.to,
          },
          this.jsplumbConnectOptions
        );
        if (this.data.lineList[i].label === "") {
          conn.setLabel({
            cssClass: `linkLabelHidden`,
          });
        } else {
          conn.setLabel({
            label: line.label,
            cssClass: `linkLabel ${line.id}`,
          });
        }
      }
      this.jsPlumb.bind("connection", (evt) => {
        let from = evt.source.id;
        let to = evt.target.id;
        this.data.lineList.push({
          from: from,
          to: to,
          label: "連線名稱",
          id: GenNonDuplicateID(8),
          Remark: "",
        });

        const data = {
          from: evt.source.id,
          to: evt.target.id,
          label: "連線名稱",
          id: GenNonDuplicateID(8),
          Remark: "",
        };
        patchLineList(data);
      });
    },
  },
};
</script>

<style lang="scss">
.flow_region {
  display: flex;
  width: 90%;
  height: 90%;
  margin: 20px auto;
  border: 1px solid #ccc;
  .nodes-wrap {
    width: 150px;
    height: 100%;
    border-right: 1px solid #ccc;
    .node {
      display: flex;
      height: 40px;
      width: 80%;
      margin: 5px auto;
      border: 1px solid #ccc;
      line-height: 40px;
      &:hover {
        cursor: grab;
      }
      &:active {
        cursor: grabbing;
      }
      .log {
        width: 40px;
        height: 40px;
      }
      .name {
        width: 0;
        flex-grow: 1;
      }
    }
  }
  .flow-wrap {
    height: 100%;
    position: relative;
    overflow: hidden;
    outline: none !important;
    flex-grow: 1;
    background-image: url("../assets/point.png");
    #flow {
      position: relative;
      width: 100%;
      height: 100%;
      .auxiliary-line-x {
        position: absolute;
        border: 0.5px dashed #2ab1e8;
        z-index: 9999;
      }
      .auxiliary-line-y {
        position: absolute;
        border: 0.5px dashed #2ab1e8;
        z-index: 9999;
      }
    }
  }
}
.jtk-connector.active {
  z-index: 9999;
  path {
    stroke: #150042;
    stroke-width: 1.5;
    animation: ring;
    animation-duration: 3s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    stroke-dasharray: 5;
  }
}
.linkLabel {
  background: #150042;
  padding: 5px 10px;
  border-radius: 10px;
  color: #fff;
  max-width: 100px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.linkLabelHidden {
  display: none;
}
@keyframes ring {
  from {
    stroke-dashoffset: 50;
  }
  to {
    stroke-dashoffset: 0;
  }
}

.sideMenu {
  position: fixed;
  right: 0px;
  top: 20%;
  display: flex;
  z-index: 49;
  margin: 0;
  transform: translateX(320px);
  transition: all 0.5s ease;
}

.sideContent {
  transform: translateX(0);
}
</style>
