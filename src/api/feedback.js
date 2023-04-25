import request from "@/utils/request"

// 获取反馈列表
export const getFeedbackList = (data) => request({ url: "/feedback/list", method: "post", data})

// 根据反馈信息id删除
export const deleteFeedback = (id) => request({ url: `/feedback/delete/${id}`, method: "delete" })

// 更新反馈信息
export const updateFeedback = (data) => request({ url: `/feedback/update`, method: "put", data })