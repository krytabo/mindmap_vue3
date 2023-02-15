<template>
  <div id="wrapper">
    <div class="line-wrap" style="margin-left: 70px">
      <div id="34v56ha2l9c000" class="state-item">State 1</div>
      <div id="5sdjugrcqhc000" class="state-item">State 2</div>
      <div v-for="item in data.nodeList" :id="item.id" :key="item.id" :style="{ top: item.top, left: item.left }" class="state-item">{{ item.nodeName }}</div>
    </div>
  </div>
  <!--<div id="flowWrap" ref="flowWrap" class="flow-wrap" @drop="drop($event)" @dragover="allowDrop($event)">
    <div id="flow">
      <div v-for="item in data.nodeList" :id="item.id" :key="item.id" class="node-item bg-white" ref="node" :style="{ top: item.top, left: item.left }">
        <div class="flex flex-col space-y-4">
          <p>{{ item.nodeName }}</p>
          &lt;!&ndash;<img v-show="item.img" :src="item.img" alt="" />&ndash;&gt;
        </div>
      </div>
    </div>
  </div>-->
</template>
<script>
import { jsPlumb } from "jsplumb";
import { nodeList, lineList } from "../config/api.js";
// import { jsplumbSetting } from "@/views/config/commonConfig";
export default {
  // props: ["yourProps"],
  name: "testPage",
  data() {
    return {
      jsPlumb: null,
      data: {
        nodeList: [],
        lineList: [],
      },
      // jsplumbSetting: jsplumbSetting,
    };
  },
  mounted() {
    this.getApi2();
    this.into();
    /*this.$nextTick(() => {
      this.init();
    });*/
  },
  methods: {
    init() {
      this.jsPlumb.ready(() => {
        /*for (let i = 0; i < this.data.lineList.length; i++) {
          let line = this.data.lineList[i];
          this.jsPlumb.connect({
            source: line.from,
            target: line.to,
          });
        }*/
        this.jsPlumb.connect({
          source: "34v56ha2l9c000",
          target: "5sdjugrcqhc000",
        });
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
    into() {
      let plumbIns = jsPlumb.getInstance();
      let defaultConfig = {
        anchor: ["Left", "Right", "Top", "Bottom"],
        grid: [10, 10],
        // 錨點、位置自適應
        Container: "flow",
        // 連線的樣式 StateMachine、Flowchart,有四種默認類型：Bezier（曲線），Straight（直線），Flowchart（流程圖），State machine（狀態機）
        Connector: ["Flowchart", { cornerRadius: 5, alwaysRespectStubs: true, stub: 5 }],
        // 滑鼠不能拖動刪除線
        ConnectionsDetachable: false,
        // 刪除連接線的時候，節點不刪除
        DeleteEndpointsOnDetach: false,
        // 連線的端點
        // Endpoint: ["Dot", {radius: 5}],
        Endpoint: [
          "Rectangle",
          {
            height: 10,
            width: 10,
          },
        ],
        // 端點的樣式
        EndpointStyle: {
          fill: "rgba(255,255,255,0)",
          outlineWidth: 1,
        },
        LogEnabled: false, //是否打開jsPlumb的內部日誌
        // 連接線的樣式
        PaintStyle: {
          stroke: "#409eff",
          strokeWidth: 2,
        },
        HoverPaintStyle: { stroke: "#ff00cc", strokeWidth: 2 },
        // 箭頭樣式
        Overlays: [
          [
            "Arrow",
            {
              width: 8,
              length: 8,
              location: 1,
            },
          ],
        ],
        RenderMode: "svg",
      };
      let relations = [
        ["34v56ha2l9c000", "5sdjugrcqhc000"],
        ["5sdjugrcqhc000", "49vcu89p5q0000"],
      ];

      plumbIns.ready(function () {
        for (let item of relations) {
          plumbIns.connect(
            {
              source: item[0],
              target: item[1],
            },
            defaultConfig
          );
        }
      });
    },
    getApi2() {
      lineList().then((res) => {
        this.data.lineList = res.data;
        console.log("axios線條", this.data.lineList);
      });
      nodeList().then((res) => {
        this.data.nodeList = res.data;
        console.log("axios座標", this.data.nodeList);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
#wrapper {
  background: radial-gradient(ellipse at top left, rgba(255, 255, 255, 1) 40%, rgba(229, 229, 229, 0.9) 100%);
  height: 100vh;
  padding: 60px 80px;
  width: 100vw;
}
.state-item {
  width: 80px;
  height: 40px;
  color: #606266;
  background: #f6f6f6;
  border: 2px solid rgba(0, 0, 0, 0.05);
  text-align: center;
  line-height: 40px;
  font-family: sans-serif;
  border-radius: 4px;
  margin-right: 60px;
}
.line-wrap {
  display: flex;
  margin-bottom: 40px;
}

.node-item {
  position: absolute;
  display: flex;
  width: 120px;
  justify-content: center;
  align-items: center;
  border: 1px solid #b7b6b6;
  border-radius: 4px;
  cursor: move;
  box-sizing: content-box;
  z-index: 9995;
  max-width: 200px;
  padding: 10px;
  &:hover {
    z-index: 9998;
    .delete-btn {
      display: block;
    }
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .log-wrap {
    width: 40px;
    height: 40px;
    border-right: 1px solid #b7b6b6;
  }
  .nodeName {
    flex-grow: 1;
    width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .node-anchor {
    display: flex;
    position: absolute;
    width: 20px;
    height: 20px;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    cursor: crosshair;
    z-index: 9999;
    background: -webkit-radial-gradient(sandybrown 10%, white 30%, #9a54ff 60%);
  }
  .anchor-top {
    top: calc(-10px);
    left: 50%;
    margin-left: calc(-10px);
  }
  .anchor-right {
    top: 50%;
    right: calc(-10px);
    margin-top: calc(-10px);
  }
  .anchor-bottom {
    bottom: calc(-10px);
    left: 50%;
    margin-left: calc(-10px);
  }
  .anchor-left {
    top: 50%;
    left: calc(-10px);
    margin-top: calc(-10px);
  }
}
.active {
  border: 1px dashed #409eff;
  box-shadow: 0px 5px 9px 0px rgba(0, 0, 0, 0.5);
}
</style>
