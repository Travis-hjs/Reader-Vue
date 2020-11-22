import config from "../modules/Config";
import store from "../store";
import { RequestParams } from "./interfaces";

/**
 * 基础请求
 * @description 可使用回调方式使用和`Promise`方式
 */
export default function request(
    method: RequestParams["method"],
    path: RequestParams["path"], 
    data: RequestParams["data"], 
    success?: RequestParams["success"], 
    fail?: RequestParams["fail"]
): Promise<any> {
    // console.log("request 运行状态：", process.env.NODE_ENV);
    return new Promise(function(resolve, reject) {
        uni.request({
            method: method,
            header: {
                "Authorization": store.userInfo.token
            },
            url: config.baseUrl + path,
            data: data,
            timeout: config.requestOvertime,
            success(res: any) {
                // console.log("request.success", res);
                if (res.data.code == 200) {
                    typeof success === "function" && success(res.data.data);
                    resolve(res.data.data);
                } else {
                    let tip = res.data.message || "服务端错误：" + res.statusCode;
                    if (res.data.code == 403) {
                        tip = "登录已过期";
                        store.userInfo.token = "";
                    }
                    uni.showToast({
                        title: tip,
                        position: "bottom"
                    });
                    typeof fail === "function" && fail(res);
                }
            },
            fail(err) {
                typeof fail === "function" && fail(err);
                reject(err);
            }
        })
    })
}
