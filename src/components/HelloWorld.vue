<template>
  <div
    class="panel-body points demo flow_chart"
    id="points"
    @click="open"
  ></div>

  <el-drawer v-model="drawer">
    <template #title>
      <h4>set title by slot</h4>
    </template>
    <template #default>
      <div>
        {{ singleState }}
      </div>
    </template>
  </el-drawer>

  <!--<div id="wrapper">
    <div class="line-wrap" style="margin-left: 70px">
      <div id="item-1" class="state-item">State 1</div>
      <div id="item-2" class="state-item">State 2</div>
      <div id="item-3" class="state-item">State 3</div>
    </div>
    <div class="line-wrap">
      <div id="item-4" class="state-item">State 4</div>
      <div id="item-5" class="state-item">State 5</div>
      <div id="item-6" class="state-item">State 6</div>
      <div id="item-7" class="state-item">State 7</div>
    </div>
    <div class="line-wrap" style="margin-left: 215px">
      <div id="item-8" class="state-item">State 8</div>
      <div id="item-9" class="state-item">State 9</div>
    </div>
  </div>

  <div id="diagramContainer">
    <div id="item_left" class="item"></div>
    <div id="item_right" class="item" style="left: 150px"></div>
  </div>-->
</template>

<script>
import $ from "jquery";
import { jsPlumb } from "jsplumb";

export default {
  name: "IndexPage",
  data() {
    return {
      drawer: false,
      singleState: {}, //右側編輯資料
      data: {
        point: [
          {
            _id: "58c21d713819d56d68763918",
            name: "",
            img: "https://m.360buyimg.com/mobilecms/s750x750_jfs/t1/124103/22/1983/161768/5ec22fe8E4235ffa7/3cf67e3a26838940.jpg!q80.dpg",
            status: "0",
            w: "250px",
            h: "200px",
          },
          {
            _id: "58c21d803819d56d68763919",
            name: "Moe",
            img: "",
            status: "1",
            w: "50px",
            h: "50px",
          },
          {
            _id: "58c21da83819d56d6876391a",
            name: "Love",
            img: "",
            status: "0",
            w: "50px",
            h: "50px",
          },
          {
            _id: "58c63ecf3819d5a22f2c7f24",
            name: "TaoBeier",
            img: "",
            status: "1",
            w: "50px",
            h: "50px",
          },
        ],
        location: [
          ["Love", 4, 24],
          ["TaoBeier", 4, 34],
          ["TaoBeier", 20, 24],
          ["Moe", 24, 4],
          ["MoeLove", 4, 4],
        ],
        line: [
          ["58c21d713819d56d68763918", "58c21d803819d56d68763919"],
          ["58c21d803819d56d68763919", "58c21da83819d56d6876391a"],
          ["58c21d803819d56d68763919", "58c63ecf3819d5a22f2c7f24"],
          ["58c21da83819d56d6876391a", ""],
        ],
      },
    };
  },
  methods: {
    open() {
      this.drawer = true;
      console.log(item);
      const item = this.data.point;
      this.singleState = item.name;
    },
    createFlow(flowData) {
      console.log("Index created");
      // const color = "#1e8151";
      const instance = jsPlumb.getInstance({
        Connector: ["Flowchart", { gap: 0, cornerRadius: 5 }],
        Endpoint: ["Dot", { radius: 5 }],
        EndpointStyles: [null, null],
        DragOptions: {},
        PaintStyle: { lineWidth: 5, stroke: "#445566" },
        EndpointStyle: {},
        HoverPaintStyle: { stroke: "#ec9f2e", lineWidth: 4 },
        EndpointHoverStyle: { fill: "#ec9f2e", stroke: "#acd" },
        ConnectionOverlays: [
          [
            "Arrow",
            {
              location: 1,
              id: "arrow",
              length: 4,
              foldback: 0.8,
              paintStyle: {
                lineWidth: 5,
                stroke: "lightgray",
                fill: "lightgray",
              },
            },
          ],
        ],
        Container: "points",
      });

      // suspend drawing and initialise.
      instance.batch(() => {
        // declare some common values:
        const arrowCommon = { foldback: 0.7, width: 12 };
        // use three-arg spec to create two different arrows with the common values:
        const overlays = [
          ["Arrow", { location: 0.7 }, arrowCommon],
          // ["Label", { label: "custom label", id: "label" }],
        ];
        // init point
        for (const point of flowData.point) {
          if (point.img === "") {
            $(".points").append(
              `<div id="${point._id}" class="point chart_act_${point.status} ${point.name}" >${point.name}
               <img src="${point.img}" style="display: none"/>
             </div>`
            );
          } else if (point.name === "" || point.img === "") {
            $(".points").append(
              `<div id="${point._id}" class="point chart_act_${point.status} ${point.name}" style="height: ${point.h}; width: ${point.w}">
               <img src="${point.img}" style="object-fit: cover; width: 100%; height: 100%"/>
             </div>`
            );
          } else {
            $(".points").append(
              `<div id="${point._id}" class="point chart_act_${point.status} ${point.name}" style="height: ${point.h}; width: ${point.w}">${point.name}
               <img src="${point.img}" style="object-fit: cover; width: 100%; height: 100%"/>
             </div>`
            );
          }

          instance.addEndpoint(
            point._id,
            {
              uuid: `${point._id}`,
              anchor: "AutoDefault",
              maxConnections: -1,
              // connectorStyle: { stroke: 'green' },
            },
            {
              // isSource: true,
              isTarget: true,
              dragAllowedWhenFull: false,
              maxConnections: -1, // 设置连接点最多可以连接几条线
            }
          );
          instance.addEndpoint(
            point._id,
            {
              uuid: `${point._id}`,
              anchor: "AutoDefault",
              maxConnections: -1,
              connectorStyle: { stroke: "gray" },
            },
            {
              // isSource: true,
              isTarget: true,
              dragAllowedWhenFull: false,
              maxConnections: -1, // 设置连接点最多可以连接几条线
            }
          );

          instance.bind("click", (conn, originalEvent) => {
            this.drawer = true;
            console.log(conn, originalEvent);
            instance.select().setPaintStyle({
              stroke: "#A5AAB9",
              outlineStroke: "transparent",
            });
            //设置当前连接线高亮
            conn.setPaintStyle({ stroke: "#0a0", outlineStroke: "#FCFD3C" });
            this.singleState = originalEvent;
          });
        }

        // init transition
        for (const i of flowData.line) {
          const uuid = [`${i[0]}`, `${i[1]}`];
          instance.connect({
            uuids: uuid,
            overlays,
          });
        }

        // init location
        for (const i of flowData.location) {
          $(`.${i[0]}`).css("left", i[1] * 20);
          $(`.${i[0]}`).css("top", i[2] * 20);
        }

        for (const point of flowData.point) {
          instance.draggable(`${point._id}`);
        }
      });

      jsPlumb.fire("jsPlumbDemoLoaded", instance);
    },
  },
  mounted() {
    jsPlumb.ready(() => {
      this.createFlow(this.data);
    });
  },
};
</script>

<!--<script>
import { jsPlumb } from "jsplumb";
export default {
  name: "landing-page",
  mounted() {
    // let plumbIns = jsPlumb.getInstance();
    /*let defaultConfig = {
      // 对应上述基本概念
      anchor: [
        "Left",
        "Right",
        "Top",
        "Bottom",
        [0.3, 0, 0, -1],
        [0.7, 0, 0, -1],
        [0.3, 1, 0, 1],
        [0.7, 1, 0, 1],
      ],
      connector: ["StateMachine"],
      endpoint: "Blank",
      // 添加样式
      paintStyle: { stroke: "#909399", strokeWidth: 2 }, // connector
      // endpointStyle: { fill: 'lightgray', outlineStroke: 'darkgray', outlineWidth: 2 } // endpoint
      // 添加 overlay，如箭头
      overlays: [["Arrow", { width: 8, length: 8, location: 1 }]], // overlay
    };*/
    let relations = [
      ["item-4", "item-1"],
      ["item-1", "item-5"],
      ["item-5", "item-2"],
      ["item-2", "item-6"],
      ["item-6", "item-3"],
      ["item-3", "item-7"],
      ["item-7", "item-9"],
      ["item-9", "item-6"],
      ["item-6", "item-8"],
      ["item-8", "item-5"],
      ["item-3", "item-9"],
      ["item-2", "item-8"],
      ["item-1", "item-4"],
      ["item-5", "item-4"],
    ];

    jsPlumb.ready(() => {
      /* //在item-4节点上添加一个端点
      let anEndpoint = plumbIns.addEndpoint("item-4", {
        anchors: [[0.7, 1, 0, 1]],
        endpoint: "Blank",
      });

      relations.push(["item-8", anEndpoint]);*/

      for (let item of relations) {
        jsPlumb.connect({
          source: item[0],
          target: item[1],
        });

        jsPlumb.draggable(item[0]);
        jsPlumb.draggable(item[1]);
      }
    });
  },
};
</script>-->

<style>
.point.chart_act_0 {
  color: #9cc;
}
.point.chart_act_1 {
  color: #fac;
}

.points .point {
  border: 0.1em dotted #d4e06b;
  width: 8em;
  height: 3em;
  line-height: 2em;
}

/** HOVER EFFECTS **/
.points .point:hover,
.points .point._jsPlumb_source_hover,
.points .point._jsPlumb_target_hover {
  border: 1px solid orange;
  color: orange;
}

.point {
  background-color: white;
  border: 1px solid #346789;
  text-align: center;
  z-index: 24;
  cursor: pointer;
  box-shadow: 2px 2px 19px #aaa;
  -o-box-shadow: 2px 2px 19px #aaa;
  -webkit-box-shadow: 2px 2px 19px #aaa;
  -moz-box-shadow: 2px 2px 19px #aaa;
  -moz-border-radius: 0.5em;
  border-radius: 0.5em;
  position: absolute;
  color: black;
  padding: 0.5em;
  width: 80px;
  height: 80px;
  line-height: 80px;
  -webkit-transition: -webkit-box-shadow 0.15s ease-in;
  -moz-transition: -moz-box-shadow 0.15s ease-in;
  -o-transition: -o-box-shadow 0.15s ease-in;
  transition: box-shadow 0.15s ease-in;
}

.point:hover {
  border: 1px solid #123456;
  box-shadow: 2px 2px 19px #444;
  -o-box-shadow: 2px 2px 19px #444;
  -webkit-box-shadow: 2px 2px 19px #444;
  -moz-box-shadow: 2px 2px 19px #fff;
  opacity: 0.9;
  filter: alpha(opacity=90);
}

path,
._jsPlumb_endpoint {
  cursor: pointer;
}

#wrapper {
  background: radial-gradient(
    ellipse at top left,
    rgba(255, 255, 255, 1) 40%,
    rgba(229, 229, 229, 0.9) 100%
  );
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
</style>
