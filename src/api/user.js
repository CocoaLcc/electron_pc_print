import request from "@/utils/request";

export function login(data) {
  return request({
    url: "/employeecardpc/login",
    method: "post",
    data,
  });
}
