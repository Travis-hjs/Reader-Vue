import { ApiListData, ListParams } from "../utils/interfaces";
import request from "../utils/request";
import utils from "../utils";
import { createBookListData } from "../utils/createBookData";

/**
 * 用户登录
 * @param form 
 */
export function login(form: { account: string | number, password: string | number }) {
    return request("POST", "/login", form);
}

/**
 * 查询用户类型
 * @param value 用户标识
 */
export function searchUserType(value: "admin" | "vip" | "normal") {
    return request("POST", "/user/searchType", { type: value });
}

/** 
 * 模拟请求数据 
 * @param params
 */
export function getTestList(params: ListParams) {
    const delay = utils.ranInt(200, 1000);
    const images = [
        "https://muse-ui.org/img/img1.35d144b4.png",
        "https://muse-ui.org/img/img2.9bd96df4.png",
        "https://muse-ui.org/img/img3.6e264e66.png",
        "https://muse-ui.org/img/sun.a646a52d.jpg",
        "https://muse-ui.org/img/breakfast.f1098290.jpg"
    ]
    const result: ApiListData = {
        code: 1,
        data: {
            pageIndex: params.pageIndex,
            pageSize: params.pageSize,
            list: []
        },
        msg: ""
    }
    return new Promise<ApiListData>(function (resolve, reject) {
        setTimeout(function () {
            if (delay > 900 && params.pageIndex !== 0) {
                result.msg = "接口查询超时"
                result.code = 0;
                resolve(result);
            } else {
                let total = params.pageSize;
                if (params.pageIndex >= 5) {
                    total = utils.ranInt(2, params.pageSize - 2);
                }
                result.msg = "success"
                result.code = 1;
                result.data.list = new Array(total).fill(0).map(function (_, index) {
                    return {
                        id: params.pageIndex * params.pageSize + index + 1,
                        value: utils.randomText(6, 30),
                        img: images[utils.ranInt(0, images.length - 1)]
                    }
                })
                resolve(result);
            }
        }, delay)
    })
}

/**
 * 获取小说列表
 * @param params 
 */
export function getBookList(params: ListParams) {
    const delay = utils.ranInt(200, 1000);
    const result: ApiListData = {
        code: 1,
        data: {
            pageIndex: params.pageIndex,
            pageSize: params.pageSize,
            list: []
        },
        msg: ""
    }
    return new Promise<ApiListData>(function (resolve, reject) {
        setTimeout(function () {
            if (delay > 900 && params.pageIndex !== 0) {
                result.msg = "接口查询超时"
                result.code = 0;
                resolve(result);
            } else {
                const total = params.pageIndex < 6 ? params.pageSize : utils.ranInt(2, params.pageSize - 2);
                result.msg = "success"
                result.code = 1;
                result.data.list = createBookListData(params.pageIndex * params.pageSize, total);
                resolve(result);
            }
        }, delay)
    })
}