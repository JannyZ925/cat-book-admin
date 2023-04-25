import request from "@/utils/request"

// 获取模块列表
export const getTipModuleList = (data) => request({ url: "/tipModule/list", method: "POST", data })

// 添加模块
export const addTipModule = (name) => request({ url: "/tipModule/add", method: "POST", data: { name } })

// 删除模块
export const deleteModuleById = (id) => request({ url: `/tipModule/delete/${id}`, method: "DELETE" })

// 修改模块名称
export const updateTipModule = (data) => request({ url: "/tipModule/update", method: "PUT", data })