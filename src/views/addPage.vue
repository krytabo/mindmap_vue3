<template>
  <div class="flex items-center justify-center space-x-4 p-4">
    <router-link to="/"><el-button type="primary" plain>返回列表</el-button></router-link>
    <router-link to="/viewPage"><el-button type="primary">存擋</el-button></router-link>
  </div>

  <div class="flow_region">
    <div class="nodes-wrap">
      <div v-for="item in nodeTypeList" :key="item.type" class="node" draggable="true" @dragstart="drag($event, item)">
        <!--<div class="log">
          <img :src="item.logImg" alt="" />
        </div>-->
        <div class="name">{{ item.typeName }}</div>
      </div>
    </div>
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
        <flowNodeEdit
          v-for="item in data.nodeList"
          :id="item.id"
          :key="item.id"
          :node="item"
          :edit="editType"
          @setNodeName="setNodeName"
          @deleteNode="deleteNode"
          @changeLineState="changeLineState"
          @dblclick.prevent="openSide(item)"
        ></flowNodeEdit>
      </div>
    </div>

    <div class="sideMenu absolute top-0 right-0 flex h-screen w-80 flex-col bg-white p-5 shadow-xl" :class="{ sideContent: showContent }">
      <div class="h-10 w-10 cursor-pointer rounded-full" @click="showContent = false">
        <i class="ri-close-circle-fill text-2xl"></i>
      </div>
      <div class="p-4">
        <el-form ref="form" :model="from" label-width="80px">
          <el-form-item label="設備名稱">
            <el-input v-model="from.nodeName"></el-input>
          </el-form-item>

          <el-form-item label="設備ID">
            <el-input v-model="from.id"></el-input>
          </el-form-item>

          <el-form-item label="設備名稱">
            <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
              <img v-if="from.img" :src="from.img" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { jsPlumb } from "jsplumb";
import { nodeTypeList } from "./config/init";
import { jsplumbSetting, jsplumbConnectOptions, jsplumbSourceOptions, jsplumbTargetOptions } from "./config/commonConfig";
import methods from "./config/methods";
import flowNodeEdit from "./components/node-itemEdit";
import { nodeList, lineList } from "./config/api.js";
import { GenNonDuplicateID } from "@/common/until";
export default {
  name: "FlowEdit",
  components: {
    flowNodeEdit,
  },
  data() {
    return {
      showContent: false, //右側詳細視窗
      from: {}, //右側詳細內容

      nodeTypeList: nodeTypeList,
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
    this.getApi();
    this.$nextTick(() => {
      this.init();
    });
  },
  created() {},
  methods: {
    ...methods,
    getApi() {
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
      lineList().then((res) => {
        this.data.lineList = res.data;
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

          /*const data = {
            from: evt.source.id,
            to: evt.target.id,
            label: "連線名稱",
            id: GenNonDuplicateID(8),
            Remark: "",
          };
          postLineList(data);*/
        });
      });
    },

    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("只能上傳png、jpg格式");
      }
      if (!isLt2M) {
        this.$message.error("不能超過2MB");
      }
      return isJPG && isLt2M;
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

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
