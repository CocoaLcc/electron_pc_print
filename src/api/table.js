import request from "@/utils/request";
//23-订单列表
export function listWelfareOrder(params) {
  return request({
    url: "/employeecardpc/welfare/listWelfareOrder",
    method: "get",
    params,
  });
}

export function printOrder(data) {
  return request({
    url: "/employeecardpc/welfare/printOrder",
    method: "post",
    data,
  });
}

export function updateWelfareOrderStatus(data) {
  return request({
    url: "/employeecardpc/welfare/updateWelfareOrderStatus",
    method: "post",
    data,
  });
}
