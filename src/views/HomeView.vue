<template>
  <router-link to="/addPage">
    <el-button>新增</el-button>
  </router-link>

  <el-table :data="tableData">
    <el-table-column label="公司名稱" prop="com_name"></el-table-column>
    <el-table-column label="設定狀態" prop="status" width="100">
      <template #default="scope">
        <el-tag v-if="scope.row.status === 1" effect="dark">已設定</el-tag>
        <el-tag v-else effect="dark" type="danger">未設定</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="100">
      <template #default="scope">
        <el-button type="text" @click="edit_list(scope.$index, scope.row)">查看</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { mindMapList } from "./config/api.js";
export default {
  name: "homeView",
  data() {
    return {
      /*tableData: [
        {
          comID: 0,
          comName: "展示社區",
          status: 1, //0=未設定 1=已設定
          mindMap: {
            nodeList: [
              {
                type: "start",
                typeName: "ZLAN",
                nodeName: "ZLAN",
                id: "34v56ha2l9c000",
                top: "260px",
                left: "240px",
                img: "https://m.360buyimg.com/mobilecms/s750x750_jfs/t1/124103/22/1983/161768/5ec22fe8E4235ffa7/3cf67e3a26838940.jpg!q80.dpg",
              },
              {
                type: "dataSet",
                typeName: "CCTV-01",
                nodeName: "CCTV-01",
                id: "5sdjugrcqhc000",
                top: "0px",
                left: "470px",
                img: "https://www.sourcesecurity.com/img/products/400/illustra-ipl02b2bnwiy-cctv-camera.jpg",
              },
              {
                type: "encode",
                typeName: "緊急壓釦",
                nodeName: "緊急壓釦",
                id: "3atqi5p6oa4000",
                top: "0px",
                left: "0px",
                img: "https://manuals.fibaro.com/wp-content/uploads/2019/05/download.png",
              },
              {
                type: "personService",
                typeName: "設備名稱3",
                nodeName: "設備名稱3",
                id: "49vcu89p5q0000",
                top: "245px",
                left: "600px",
                img: "",
              },
              {
                type: "arrange",
                typeName: "設備名稱4",
                nodeName: "設備名稱4",
                id: "1jhiilb0t2tc00",
                top: "180px",
                left: "880px",
                img: "",
              },
              {
                type: "end",
                typeName: "設備名稱5",
                nodeName: "設備名稱5",
                id: "1ogr3wzy6zhc00",
                top: "180px",
                left: "1160px",
                img: "",
              },
              {
                type: "end",
                typeName: "設備名稱6",
                nodeName: "設備名稱6",
                id: "1ogr3wzy6zhc01",
                top: "480px",
                left: "470px",
                img: "",
              },
            ],
            lineList: [
              {
                form: "34v56ha2l9c000",
                to: "5sdjugrcqhc000",
                label: "",
                id: "5n6pp5xqd6s000",
                Remark: "",
              },
              {
                form: "5sdjugrcqhc000",
                to: "49vcu89p5q0000",
                label: "連線名稱",
                id: "zoisvo5gpvk00",
                Remark: "",
              },
              {
                form: "49vcu89p5q0000",
                to: "1jhiilb0t2tc00",
                label: "連線名稱",
                id: "ldc917l47w000",
                Remark: "",
              },
              {
                form: "1jhiilb0t2tc00",
                to: "1ogr3wzy6zhc00",
                label: "連線名稱",
                id: "478galw3u34000",
                Remark: "",
              },
              {
                form: "3atqi5p6oa4000",
                to: "34v56ha2l9c000",
                label: "連線名稱",
                id: "494f5sbsn9c000",
                Remark: "",
              },
              {
                form: "34v56ha2l9c000",
                to: "1ogr3wzy6zhc01",
                label: "連線名稱連線名稱連線名稱連線名稱連線名稱",
                id: "494f5sbsn9c002",
                Remark: "",
              },
            ],
          },
        },
        {
          comID: 0,
          comName: "展示社區2",
          status: 0, //0=未設定 1=已設定
          mindMap: {},
        },
      ],*/
      tableData: [],
    };
  },
  methods: {
    getApi() {
      mindMapList().then((res) => {
        this.tableData = res.data;
      });
    },

    edit_list(index, result) {
      let data = JSON.stringify(result);
      this.$router.push({ path: "/viewPage", query: { res: data, editStatus: false } });
    },
  },
  mounted() {
    this.getApi();
  },
};
</script>

<style scoped></style>
