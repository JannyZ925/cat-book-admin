import request from "@/utils/request.js";

// 获取猫咪数据
export const getCatList = (data) => request({ url: "/cat/list", method: "post", data });

// 添加猫咪信息
export const addCat = (data) => request({ url: "/cat/add", method: "post", data});

// 删除猫咪信息
export const deleteCatById = (id) => request({url: `/cat/delete/${id}`, method: "delete"})

// 更新猫咪信息
export const updateCat = (data) => request({ url: "/cat/update", method: "put", data})

