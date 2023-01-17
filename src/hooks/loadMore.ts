import { reactive } from "vue";
import { onReachBottom } from "@dcloudio/uni-app";
import { showToast } from "@/utils/control";
import { modifyData } from "@/utils";

export interface LoadMoreInfo<T = any> extends PageInfo {
  /** 加载状态 */
  state: "wait" | "loading" | "nomore"
  /** 加载的列表数据 */
  list: Array<T>
  /**
   * 请求成功次数
   * - 成功时才会累加，`requestCount === 1` 时为首次获取数据 
  */
  requestCount: number
  /** 
   * 列表数据`key`值，因为每个后台返回的数组字段不一样，所以这里加一个动态设置的字段
   * @example
   * ```js
   * // 假设后台返回的数据是这样的：
   * const res = {
   *    currentPage: 1,
   *    records: [...],
   *    pageSize: 10
   *    ...more
   * }
   * // 那么 listDataKey = "records";
   * // 默认 listDataKey = "list";
   * ```
   */
  listDataKey: string
}

/** 加载更多数据对象 */
export function useLoadMoreData(): LoadMoreInfo {
  return {
    state: "wait",
    list: [],
    currentPage: 1,
    pageSize: 10,
    requestCount: 0,
    listDataKey: "list"
  }
}

/**
 * 加载更多-功能函数
 */
export default function useLoadMore() {

  /** 加载更多数据 */
  const loadMoreData = reactive(useLoadMoreData());

  /** 请求函数 */
  let requestListFn: () => Promise<ApiResult<ApiResultList>>;

  /**
   * 设置请求函数
   * @param fn 
   */
  function setRequestListFn(fn: () => Promise<ApiResult<ApiResultList>>) {
    requestListFn = fn;
  }

  /**
   * 开始请求获取列表数据
   * @param callback 加载结束回调
   */
  function getData(callback?: () => void) {
    if (!requestListFn) return console.log("%c 请调用“setRequestListFn”方法设置请求函数 >>", "color: #4fc08d");
    const { state, list } = loadMoreData;
    if (state === "nomore" || state === "loading") return;
    loadMoreData.state = "loading";
    requestListFn().then(result => {
      loadMoreData.state = "wait";
      if (result.code === 1) {
        const listData = result.data[loadMoreData.listDataKey as "list"];
        loadMoreData.requestCount++;
        loadMoreData.list = list.concat(listData);
        // 判断是否没有数据了
        // result.data.totalCount >= loadMoreData.list.length
        if (listData.length < loadMoreData.pageSize) {
          loadMoreData.state = "nomore";
        } else {
          loadMoreData.currentPage++;
        }
      } else {
        showToast(result.msg || "加载列表出错");
      }
      callback && callback();
    }).catch(error => {
      console.log("%c getListData error >>", "color: #f04e7d", error);
      loadMoreData.state = "wait";
      callback && callback();
    })
  }

  /**
   * 刷新数据
   * @param callback 
   */
  function refreshData(callback?: () => void) {
    loadMoreData.currentPage = 1;
    loadMoreData.list = [];
    loadMoreData.state = "wait";
    getData(callback);
  }

  /** 重置列表数据 */
  function resetListData() {
    modifyData(loadMoreData, useLoadMoreData());
  }

  onReachBottom(function () {
    getData();
  })

  return {
    loadMoreData,
    refreshData,
    resetListData,
    setRequestListFn
  }
}
