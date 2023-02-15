import axios from "axios";

const dataList = axios.create({
  baseURL: "http://localhost:3000",
});

export const nodeList = (data) => dataList.get("/nodeList", data);
export const lineList = () => dataList.get("/lineList");
export const patchLineList = () => dataList.patch("/lineList");
export const postLineList = () => dataList.post("/lineList");

export const mindMapList = (data) => dataList.get("/data", data);
