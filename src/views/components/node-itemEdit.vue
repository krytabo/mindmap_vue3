<template>
  <div
    class="node-item bg-white"
    ref="node"
    :class="[isActive || isSelected ? 'active' : '']"
    :style="flowNodeContainer"
    v-click-outside="setNotActive"
    @click="setActive"
    @mouseenter="showAnchor"
    @mouseleave="hideAnchor"
    @contextmenu.prevent="onContextmenu"
  >
    <!--<div class="log-wrap">
      <img :src="node.logImg" alt="" />
    </div>-->
    <div class="flex flex-col space-y-4">
      <p>{{ node.nodeName }}</p>
      <img v-show="node.img" :src="node.img" alt="" />
    </div>
    <!--連線用--//觸發連線的區域-->
    <div class="node-anchor anchor-top" v-show="mouseEnter"></div>
    <div class="node-anchor anchor-right" v-show="mouseEnter"></div>
    <div class="node-anchor anchor-bottom" v-show="mouseEnter"></div>
    <div class="node-anchor anchor-left" v-show="mouseEnter"></div>

    <!--<el-drawer title="我是标题" v-model="drawer">
      {{ newNodeName }}
    </el-drawer>-->
  </div>
</template>

<script>
export default {
  name: "nodeItem",
  props: {
    node: Object,
    edit: Boolean,
  },
  computed: {
    // 节点容器样式
    flowNodeContainer: {
      get() {
        return {
          top: this.node.top,
          left: this.node.left,
        };
      },
    },
  },
  data() {
    return {
      drawer: false,
      mouseEnter: false,
      isActive: false,
      isSelected: false,
      editType: this.edit,
    };
  },
  methods: {
    showAnchor() {
      this.mouseEnter = true;
    },
    hideAnchor() {
      this.mouseEnter = false;
    },
    onContextmenu(e) {
      this.$contextmenu({
        x: e.x,
        y: e.y,
        items: [
          {
            label: "删除",
            icon: "ri-delete-bin-fill",
            disabled: false,
            onClick: () => {
              this.deleteNode();
            },
          },
        ],
        event,
        customClass: "custom-class",
        zIndex: 9999,
        minWidth: 180,
      });
    },
    setActive() {
      if (window.event.ctrlKey) {
        this.isSelected = !this.isSelected;
        return false;
      }
      this.isActive = true;
      this.isSelected = false;
      setTimeout(() => {
        this.$emit("changeLineState", this.node.id, true);
      }, 0);
    },
    setNotActive() {
      if (!window.event.ctrlKey) {
        this.isSelected = false;
      }
      if (!this.isActive) {
        return;
      }
      this.$emit("changeLineState", this.node.id, false);
      this.isActive = false;
    },
    editNode() {
      this.newNodeName = this.node.nodeName;
      this.drawer = true;
      /*this.$Modal.confirm({
        render: (h) => {
          return h("Input", {
            props: {
              value: this.newNodeName,
              autofocus: true,
            },
            on: {
              input: (val) => {
                this.newNodeName = val;
              },
            },
          });
        },
        onOk: () => {
          console.log(this.newNodeName);
          this.$emit("setNodeName", this.node.id, this.newNodeName);
        },
      });*/
      /* this.$alert(this.newNodeName, "HTML 片段", {
        dangerouslyUseHTMLString: true,
      });*/
    },
    deleteNode() {
      this.$emit("deleteNode", this.node);
    },
  },
};
</script>

<style lang="scss" scoped>
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
