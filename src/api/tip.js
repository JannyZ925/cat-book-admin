import request from "@/utils/request"

// 获取科普知识列表
export const getTipList = (data) => request({ url: "/tip/list", method: "POST", data })

// 添加科普知识
export const addTip = (data) => request({ url: "/tip/add", method: "POST", data })

// 删除科普知识
export const deleteTipById = (id) => request({ url: `/tip/delete/${id}`, method: "DELETE" })

// 修改科普知识
export const updateTip = (data) => request({ url: "/tip/update", method: "PUT", data })