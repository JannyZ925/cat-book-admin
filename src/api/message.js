import request from "@/utils/request.js";

// 获取留言列表
export const getMessageList = (data) => request({ url: "/message/list", method: "post", data });

// 删除留言
export const deleteMessageById = (id) => request({ url: `/message/delete/${id}`, method: "delete" });
