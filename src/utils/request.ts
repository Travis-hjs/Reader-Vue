import config from "./config";
import store from "@/store";

function getResultInfo(result: { statusCode: number, data: any }) {
  const info: ApiResult = { code: -1, msg: "", data: null }
  switch (result.statusCode) {
    case 999:
      info.msg = "网络出错了";
      break;
    case 200:
      info.code = 1;
      info.msg = "ok";
      info.data = result.data;
      break;
    case 400:
      info.msg = "接口传参不正确";
      break;
    case 403:
      info.msg = "登录已过期";
      store.user.reset();
      break;
    case 404:
      info.msg = "接口不存在";
      break;
    default:
      break;
  }
  if (result.statusCode >= 500) {
    info.msg = "服务器闹脾气了";
  }
  return info;
}

/**
 * 基础请求
 * @param method 请求方法
 * @param path 请求路径
 * @param data 请求参数
 * @param options 其他配置参数
 */
export default function request<T>(method: "GET" | "POST" | "DELETE" | "PUT", path: string, data?: any, options: Partial<RequestOptions> = {}) {
  const headers = options.headers || {};
  return new Promise<ApiResult<T>>(function (resolve, reject) {
    uni.request({
      method: method,
      header: {
        "Authorization": store.user.info.token,
        ...headers
      },
      url: config.apiUrl + path,
      data: data,
      timeout: config.requestOvertime,
      success(res) {
        // console.log("request.success", res);
        const info = getResultInfo(res);
        if (info.code !== 1 && options.showTip) {
          uni.showToast({
            title: typeof options.showTip === 'boolean' ? (info.msg || "操作失败") : options.showTip as string,
            position: "bottom",
            icon: "none",
            duration: 2400
          });
        }
        resolve(info);
      },
      fail(err) {
        const info = getResultInfo({ statusCode: 999, data: null });
        info.msg = err.errMsg;
        resolve(info);
      }
    })
  })
}
