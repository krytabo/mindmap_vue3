export const jsplumbSetting = {
  grid: [10, 10],
  // 錨點、位置自適應
  Anchors: ["TopCenter", "RightMiddle", "BottomCenter", "LeftMiddle"],
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

// jsplumb連接參數
export const jsplumbConnectOptions = {
  isSource: true,
  isTarget: true,
  // 動態錨點、提供4個方向 Continuous、AutoDefault
  anchor: ["TopCenter", "RightMiddle", "BottomCenter", "LeftMiddle"],
};

export const jsplumbSourceOptions = {
  filter: ".node-anchor", //觸發連線的區域
  /*"span"表示標籤，".className"表示種類，"#id"表示元素id*/
  filterExclude: false,
  anchor: ["TopCenter", "RightMiddle", "BottomCenter", "LeftMiddle"],
  allowLoopback: false,
};

export const jsplumbTargetOptions = {
  filter: ".node-anchor",
  /*"span"表示標籤，".className"表示種類，"#id"表示元素id*/
  filterExclude: false,
  anchor: ["TopCenter", "RightMiddle", "BottomCenter", "LeftMiddle"],
  allowLoopback: false,
};
