import request from "@/utils/request.js";

// 分页获取猫咪照片
export const getPictures = (data) => request({ url: "/pic/list/page", method: "post", data })

// 根据id删除猫咪照片
export const deletePictureById = (id) => request({ url: `/pic/delete/${id}`, method: "delete" })

// 更新封面
export const updateCover = (catId, picId) => request({ url: `/pic/updateCover/${catId}/${picId}`, method: "put" })

// 设置轮播图
export const setSwiper = (picId) => request({ url: `/pic/setSwiper/${picId}`, method: "put" })

// 取消轮播图
export const cancelSwiper = (picId) => request({ url: `/pic/cancelSwiper/${picId}`, method: "put" })

// 插入多张图片
export const insertPics = (data) => request({ url: "/pic/insertBatch", method: "post", data })



