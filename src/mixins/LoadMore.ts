import { Component, Vue } from "vue-property-decorator";
import { ApiListData, LoadMoreType } from "../utils/interfaces";
import utils from "../utils";

function createLoadMoreData(): LoadMoreType {
    return {
        state: "wait",
        list: [],
        pageIndex: 0,
        pageSize: 10
    }
}

/** 滚动到底部加载更多 */
@Component({})
export default class LoadMore extends Vue {

    /** 加载数据信息 */
    loadMoreData = createLoadMoreData();

    /** 请求数据的异步函数 */
    requestList?(): Promise<ApiListData>
    
    /** 获取数据之后的回调（需要的时候可能会用到） */
    getListCallback?(res: ApiListData): void;

    /** 重置列表数据 */
    resetListData() {
        this.loadMoreData = createLoadMoreData();
    }

    /**
     * 开始请求获取列表数据
     * @param callback 加载结束回调
    */
    getListData(callback?: () => void) {
        const {state, list} = this.loadMoreData;
        if (state === "nomore" || state === "loading") return;
        if (!this.requestList) return console.log("%c 没有声明【getListData】方法 >>", "color: #4fc08d");
        this.loadMoreData.state = "loading";
        this.requestList().then(result => {
            this.loadMoreData.state = "wait";
            if (result.state === 1) {
                this.loadMoreData.list = list.concat(result.data.data);
                // 判断是否没有数据了
                if (result.data.data.length < this.loadMoreData.pageSize) {
                    this.loadMoreData.state = "nomore";
                } else {
                    this.loadMoreData.pageIndex++;
                }
                this.getListCallback && this.getListCallback(result);
            } else {
                utils.showToast(result.msg || "加载列表出错");
            }
            callback && callback();
        }).catch(error => {
            console.log("%c getListData error >>", "color: #f04e7d", error);
            this.loadMoreData.state = "wait";
            callback && callback();
        })
    }

    /**
     * 生命周期回调 监听页面隐藏
     *
     * 页面隐藏/切入后台时触发。 如 `navigateTo` 或底部 `tab` 切换到其他页面，应用切入后台等。
     */
    async onReachBottom() {
        this.getListData();
    }
}