import axios from "axios";
import { MessageBox, Message } from "element-ui";
import store from "@/store";
// import { getToken } from "@/utils/auth";
//dev apikey
// const apikey = "1HVyhuAeXG5CLF0JztFM7Cvugb94kRam"
// prod apikey
// const apikey = "4SPcxWzRFg3dv0YGOB7Kp9epoQcYbC4E"

//
const apikey = process.env.VUE_APP_API_KEY;

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: false, // send cookies when cross-domain requests
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 7000,
  crossDomain: true,
  async: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Api-Version": "1.1",
    apikey,
  },
});

// request interceptor
service.interceptors.request.use(
  (config) => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers["token"] = store.getters.token;
    }
    console.log("service.interceptors.");
    return config;
  },
  (error) => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    const res = response.data;

    console.log("res==>>" + JSON.stringify(res));
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      Message({
        message: res.msg || "Error",
        type: "error",
        duration: 5 * 1000,
      });

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 401 || res.code === 50014) {
        // to re-login
        MessageBox.confirm(
          "您的登录已过期, 您可以取消保留在此页面, 或者重新登录",
          "确认登出",
          {
            confirmButtonText: "重新登录",
            cancelButtonText: "取消",
            type: "warning",
          }
        ).then(() => {
          store.dispatch("user/resetToken").then(() => {
            // location.reload();
            this.$router.push("/login");
          });
        });
      }
      return Promise.reject(new Error(res.message || "Error"));
    } else {
      return res;
    }
  },
  (error) => {
    console.log("err" + error); // for debug
    Message({
      message: error.message,
      type: "error",
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);

export default service;
