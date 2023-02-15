import panzoom from "panzoom";
// import panzoom from "vue-panzoom";
// import { patchLineList } from "@/views/config/api.js";
import { GenNonDuplicateID } from "@/common/until";

const methods = {
  /*init() {
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
    console.log(this.data.nodeList, 11111);
    // 節點初始化
    for (let i = 0; i < this.data.nodeList.length; i++) {
      let node = this.data.nodeList[i];
      console.log(node, 2222);
      // 设置源点，可以拖出线连接其他节点
      this.jsPlumb.makeSource(node.id, this.jsplumbSourceOptions);
      console.log(node.id);
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
      conn.setLabel({
        label: line.label,
        cssClass: `linkLabel ${line.id}`,
      });
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
  },*/
  draggableNode(nodeId) {
    this.jsPlumb.draggable(nodeId, {
      grid: this.commonGrid,
      drag: (params) => {
        this.alignForLine(nodeId, params.pos);
      },
      start: () => {},
      stop: (params) => {
        this.auxiliaryLine.isShowXLine = false;
        this.auxiliaryLine.isShowYLine = false;
        this.changeNodePosition(nodeId, params.pos);
      },
    });
  },
  //移動節點時，動態顯示對齊線
  /*alignForLine(nodeId, position) {
    let showXLine = false,
      showYLine = false;
    this.data.nodeList.some((el) => {
      if (el.id !== nodeId && el.left === position[0] + "px") {
        this.auxiliaryLinePos.x = position[0] + 60;
        showYLine = true;
      }
      if (el.id !== nodeId && el.top === position[1] + "px") {
        this.auxiliaryLinePos.y = position[1] + 20;
        showXLine = true;
      }
    });
    this.auxiliaryLine.isShowYLine = showYLine;
    this.auxiliaryLine.isShowXLine = showXLine;
  },*/
  changeNodePosition(nodeId, pos) {
    this.data.nodeList.some((v) => {
      if (nodeId === v.id) {
        v.left = pos[0] + "px";
        v.top = pos[1] + "px";
        return true;
      } else {
        return false;
      }
    });
  },

  /*addLine(line) {
    /!*let from = line.source.id;
    let to = line.target.id;
    this.data.lineList.push({
      from: from,
      to: to,
      label: "連線名稱",
      id: GenNonDuplicateID(8),
      Remark: "",
    });*!/

    const data = {
      from: line.source.id,
      to: line.target.id,
      label: "連線名稱",
      id: GenNonDuplicateID(8),
      Remark: "",
    };
    patchLineList(data);
  },*/

  getScale() {
    let scale1;
    if (this.jsPlumb.pan) {
      const { scale } = this.jsPlumb.pan.getTransform();
      scale1 = scale;
    } else {
      const matrix = window.getComputedStyle(this.jsPlumb.getContainer()).transform;
      scale1 = matrix.split(", ")[3] * 1;
    }
    this.jsPlumb.setZoom(scale1);
    return scale1;
  },

  /** 編輯時呼叫的function */
  // 刪除連線
  confirmDelLine(line) {
    this.$Modal.confirm({
      title: "刪除連線",
      content: "<p>是否確認刪除該連線？</p>",
      onOk: () => {
        this.jsPlumb.deleteConnection(line);
      },
    });
  },
  deleLine(line) {
    this.data.lineList.forEach((item, index) => {
      if (item.from === line.sourceId && item.to === line.targetId) {
        this.data.lineList.splice(index, 1);
      }
    });
  },

  //刪除節點
  deleteNode(node) {
    this.data.nodeList.some((v, index) => {
      if (v.id === node.id) {
        this.data.nodeList.splice(index, 1);
        this.jsPlumb.remove(v.id);
        return true;
      } else {
        return false;
      }
    });
  },

  /** 拖動增加新的節點 */
  // dragover默認不觸發drag
  allowDrop(event) {
    event.preventDefault();
  },
  drag(ele, item) {
    this.currentItem = item;
  },
  drop(event) {
    const containerRect = this.jsPlumb.getContainer().getBoundingClientRect();
    const scale = this.getScale();
    let left = (event.pageX - containerRect.left - 60) / scale;
    let top = (event.pageY - containerRect.top - 20) / scale;

    var temp = {
      ...this.currentItem,
      id: GenNonDuplicateID(8),
      top: Math.round(top / 20) * 20 + "px",
      left: Math.round(left / 20) * 20 + "px",
    };
    this.addNode(temp);
  },
  addNode(temp) {
    this.data.nodeList.push(temp);
    this.$nextTick(() => {
      this.jsPlumb.makeSource(temp.id, this.jsplumbSourceOptions);
      this.jsPlumb.makeTarget(temp.id, this.jsplumbTargetOptions);
      this.draggableNode(temp.id);
    });
  },

  /** 縮放 */
  initPanZoom() {
    const mainContainer = this.jsPlumb.getContainer();
    const mainContainerWrap = mainContainer.parentNode;
    const pan = panzoom(mainContainer, {
      smoothScroll: false,
      bounds: true,
      // autocenter: true,
      zoomDoubleClickSpeed: 1,
      minZoom: 0.5,
      maxZoom: 2,
      //設置縮放的組合鍵，默認不需要
      /*beforeWheel: (e) => {
        console.log("滾輪狀態", e);
        // let shouldIgnore = !e.ctrlKey
        // return shouldIgnore
      },*/
      beforeMouseDown: function (e) {
        // allow mouse-down panning only if altKey is down. Otherwise - ignore
        var shouldIgnore = e.ctrlKey;
        return shouldIgnore;
      },
    });
    this.jsPlumb.mainContainerWrap = mainContainerWrap;
    this.jsPlumb.pan = pan;
    // 縮放時設定jsPlumb的縮放比例
    pan.on("zoom", (e) => {
      const { x, y, scale } = e.getTransform();
      this.jsPlumb.setZoom(scale);
      //依照縮放比例，對齊輔助線的長度跟位置
      this.auxiliaryLinePos.width = (1 / scale) * 100 + "%";
      this.auxiliaryLinePos.height = (1 / scale) * 100 + "%";
      this.auxiliaryLinePos.offsetX = -(x / scale);
      this.auxiliaryLinePos.offsetY = -(y / scale);
    });
    pan.on("panend", (e) => {
      const { x, y, scale } = e.getTransform();
      this.auxiliaryLinePos.width = (1 / scale) * 100 + "%";
      this.auxiliaryLinePos.height = (1 / scale) * 100 + "%";
      this.auxiliaryLinePos.offsetX = -(x / scale);
      this.auxiliaryLinePos.offsetY = -(y / scale);
    });

    // 移動時設定滑鼠的樣式
    mainContainerWrap.style.cursor = "grab";
    mainContainerWrap.addEventListener("mousedown", function wrapMousedown() {
      this.style.cursor = "grabbing";
      mainContainerWrap.addEventListener("mouseout", function wrapMouseout() {
        this.style.cursor = "grab";
      });
    });
    mainContainerWrap.addEventListener("mouseup", function wrapMouseup() {
      this.style.cursor = "grab";
    });
  },

  /*setNodeName(nodeId, name) {
    this.data.nodeList.some((v) => {
      if (v.id === nodeId) {
        v.nodeName = name;
        return true;
      } else {
        return false;
      }
    });
  },*/

  //點擊時連線的樣式改變
  changeLineState(nodeId, val) {
    // console.log("變更連線狀態", val);
    let lines = this.jsPlumb.getAllConnections();
    lines.forEach((line) => {
      if (line.targetId === nodeId || line.sourceId === nodeId) {
        if (val) {
          line.canvas.classList.add("active");
        } else {
          line.canvas.classList.remove("active");
        }
      }
    });
  },

  //初始化節點位置，方便對齊，置中
  fixNodesPosition() {
    if (this.data.nodeList && this.$refs.flowWrap) {
      const nodeWidth = 120;
      const nodeHeight = 40;
      let wrapInfo = this.$refs.flowWrap.getBoundingClientRect();
      let maxLeft = 0,
        minLeft = wrapInfo.width,
        maxTop = 0,
        minTop = wrapInfo.height;
      let nodePoint = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      };
      let fixTop = 0,
        fixLeft = 0;
      this.data.nodeList.forEach((el) => {
        let top = Number(el.top.substring(0, el.top.length - 2));
        let left = Number(el.left.substring(0, el.left.length - 2));
        maxLeft = left > maxLeft ? left : maxLeft;
        minLeft = left < minLeft ? left : minLeft;
        maxTop = top > maxTop ? top : maxTop;
        minTop = top < minTop ? top : minTop;
      });
      nodePoint.left = minLeft;
      nodePoint.right = wrapInfo.width - maxLeft - nodeWidth;
      nodePoint.top = minTop;
      nodePoint.bottom = wrapInfo.height - maxTop - nodeHeight;

      fixTop = nodePoint.top !== nodePoint.bottom ? (nodePoint.bottom - nodePoint.top) / 2 : 0;
      fixLeft = nodePoint.left !== nodePoint.right ? (nodePoint.right - nodePoint.left) / 2 : 0;

      this.data.nodeList.map((el) => {
        let top = Number(el.top.substring(0, el.top.length - 2)) + fixTop;
        let left = Number(el.left.substring(0, el.left.length - 2)) + fixLeft;
        el.top = Math.round(top / 20) * 20 + "px";
        el.left = Math.round(left / 20) * 20 + "px";
      });
    }
  },
};

export default methods;
