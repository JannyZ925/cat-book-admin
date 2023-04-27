import request from "@/utils/request";

// 获取所有猫咪常住地列表
export const getPlaceList = () => request({ url: "/place/list", method: "POST" })

// 分页获取猫咪常住地列表
export const getPlaceListByPage = (data) => request({ url: "/place/page", method: "POST", data })

// 添加猫咪常住地
export const addPlace = (data) => request({ url: "/place/add", method: "POST", data })

// 删除猫咪常住地
export const deletePlaceById = (id) => request({ url: `/place/delete/${id}`, method: "DELETE" })

// 修改猫咪常住地
export const updatePlace = (data) => request({ url: "/place/update", method: "PUT", data })