import { createBookListData } from '@/hooks/book';
import { randomText, ranInt } from '@/utils';
import request from '@/utils/request';

// ============================= 常用接口模块 =============================

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

const images = [
  "https://muse-ui.org/img/img1.35d144b4.png",
  "https://muse-ui.org/img/img2.9bd96df4.png",
  "https://muse-ui.org/img/img3.6e264e66.png",
  "https://muse-ui.org/img/sun.a646a52d.jpg",
  "https://muse-ui.org/img/breakfast.f1098290.jpg"
]

const testList = new Array(52).fill(0).map((_, index) => {
  return {
    id: index + 1,
    name: randomText(6, 30),
    img: images[ranInt(0, images.length - 1)]
  }
})

/** 
 * 模拟请求数据 
 * @param params
 */
export function getTestList(params: PageInfo & { id?: number, keyword?: string }) {
  const delay = ranInt(200, 2000);

  const result: ApiResult<ApiResultList> = {
    code: -1,
    data: {
      currentPage: params.currentPage,
      pageSize: params.pageSize,
      list: [],
      total: testList.length
    },
    msg: ""
  }

  return new Promise<ApiResult<ApiResultList>>(function (resolve, reject) {
    setTimeout(function () {
      if (delay > 1500) {
        result.msg = "接口查询超时"
        resolve(result);
      } else {
        result.msg = "success";
        result.code = 1;
        const index = (params.currentPage - 1) * params.pageSize;
        let list = [...testList].splice(index, params.pageSize);
        if (params.keyword) {
          list = list.map(item => {
            return {
              id: item.id,
              name: `${params.keyword}:${item.name}`,
              img: item.img
            }
          });
        }
        result.data.list = list;
        resolve(result);
      }
    }, delay)
  })
}

/**
 * 获取小说列表
 * @param params 
 */
export function getBookList(params: PageInfo) {
  const delay = ranInt(200, 1000);
  const result: ApiResult<ApiResultList> = {
    code: 1,
    data: {
      currentPage: params.currentPage,
      pageSize: params.pageSize,
      list: []
    },
    msg: ""
  }
  return new Promise<ApiResult<ApiResultList>>(function (resolve, reject) {
    setTimeout(function () {
      if (delay > 900 && params.currentPage !== 0) {
        result.msg = "接口查询超时"
        result.code = 0;
        resolve(result);
      } else {
        const total = params.currentPage < 6 ? params.pageSize : ranInt(2, params.pageSize - 2);
        result.msg = "success"
        result.code = 1;
        result.data.list = createBookListData(params.currentPage * params.pageSize, total);
        resolve(result);
      }
    }, delay)
  })
}