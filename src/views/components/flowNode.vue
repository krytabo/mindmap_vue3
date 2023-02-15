<template>
  <div
    ref="node"
    class="node-item"
    :class="{
      isStart: node.type === 'start',
      isEnd: node.type === 'end',
      'common-circle-node': node.type === 'start' || node.type === 'end' || node.type === 'event',
      'common-rectangle-node': node.type === 'common' || node.type === 'freedom' || node.type === 'child-flow',
      'common-diamond-node': node.type === 'gateway',
      'common-x-lane-node': node.type === 'x-lane',
      'common-y-lane-node': node.type === 'y-lane',
    }"
    :style="{
      top: node.y + 'px',
      left: node.x + 'px',
    }"
    @click="setNotActive"
    @mouseenter="showAnchor"
    @mouseleave="hideAnchor"
  >
    <div class="nodeName">{{ node.nodeName }}</div>
  </div>
</template>

<script>
export default {
  name: "flowNode",
  methods: {
    init() {
      this.jsPlumb.ready(() => {
        // 导入默认配置
        this.jsPlumb.importDefaults(this.jsplumbSetting);
        // 完成连线前的校验
        this.jsPlumb.bind("beforeDrop", (evt) => {
          console.log(evt);
          const res = () => {}; // 此处可以添加是否创建连接的校验， 返回 false 则不添加；
          return res;
        });

        this.loadEasyFlow();
        // 会使整个jsPlumb立即重绘。
        this.jsPlumb.setSuspendDrawing(false, true);
      });
      this.initPanZoom();
    },
    // 加载流程图
    loadEasyFlow() {
      // 初始化节点
      for (let i = 0; i < this.data.nodeList.length; i++) {
        const node = this.data.nodeList[i];
        // 设置源点，可以拖出线连接其他节点
        this.jsPlumb.makeSource(node.id, this.jsplumbSourceOptions);
        // // 设置目标点，其他源点拖出的线可以连接该节点
        this.jsPlumb.makeTarget(node.id, this.jsplumbTargetOptions);
        // this.jsPlumb.draggable(node.id);
        this.draggableNode(node.id);
      }

      // 初始化连线
      this.jsPlumb.unbind("connection"); // 取消连接事件
      console.log(this.data.lineList);
      for (let i = 0; i < this.data.lineList.length; i++) {
        const line = this.data.lineList[i];
        const conn = this.jsPlumb.connect(
          {
            source: line.sourceId,
            target: line.targetId,
            paintStyle: {
              stroke: line.cls.linkColor,
              strokeWidth: 2,
              // strokeWidth: line.cls.linkThickness
            },
          },
          this.jsplumbConnectOptions
        );
        conn.setLabel({
          label: line.label,
          cssClass: `linkLabel ${line.id}`,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.node-item {
  position: absolute;
  display: flex;
  height: 40px;
  width: 120px;
  justify-content: center;
  align-items: center;
  border: 1px solid #b7b6b6;
  border-radius: 4px;
  cursor: move;
  box-sizing: content-box;
  font-size: 12px;
  z-index: 9995;
  &:hover {
    z-index: 9998;
    .delete-btn {
      display: block;
    }
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
    text-align: center;
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
.common-circle-node {
  border-radius: 50%;
  height: 60px;
  width: 60px;
}
</style>
