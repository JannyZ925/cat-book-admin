import request from "@/utils/request"

export const login = (data) => request({url: "/admin/login", method: "post", data } )