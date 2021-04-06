import ModuleAppOption from "./AppOption";
import utils from "../utils";
import { 
    DeepPartial,
    DeepReadonly,
    UserInfoType 
} from "../utils/interfaces";

const cacheName = "user-info";

export class ModuleStore extends ModuleAppOption {
    constructor() {
        super();
        this.initUserInfo();
        this.initBookOption();
    }

    /** 图片对象集 */
    get imageInfo() {
        // 需要用作背景图的可以用`require`引入
        return {
            iconWx: "/static/logo_wx.png",
            iconZfb: "/static/logo_zfb.png",
            logo: "/static/logo.png",
            defaultHead: "/static/default_head.png",
            noneData: "/static/none_data.png",
        }
    }

    /** 用户信息 */
    readonly userInfo: DeepReadonly<UserInfoType> = {
        id: "",
        token: "",
        phone: ""
    }

    /**
     * 更新用户信息字段
     * @param value 
     */
    updateUserInfo(value: DeepPartial<UserInfoType>) {
        utils.modifyData(this.userInfo, value);
        uni.setStorageSync(cacheName, JSON.stringify(this.userInfo));
    }

    /** 初始化用户数据（从本地获取） */
    private initUserInfo() {
        const data = uni.getStorageSync(cacheName);
        if (data) {
            this.updateUserInfo(JSON.parse(data));
        }
    }

    /** 小说操作信息 */
    readonly bookOption = {
        /** 是否首次打开 */
        first: true,
        /** 主题 */
        theme: 1,
        /** 阅读器字体信息 */
        sizeInfo: {
            /** 标题字体大小 */
            title: 24,
            /** 段落字体大小 */
            p: 18,
            /** 标题行高 */
            tLineHeight: 24 * 1.5,
            /** 段落行高 */
            pLineHeight: 18 * 1.5,
            /** 下边距 */
            margin: 18
        }
    }

    /** 保存小说操作信息 */
    saveBookOption() {
        uni.setStorageSync("book-app-option", JSON.stringify(this.bookOption));
    }

    /** 获取小说操作信息 */
    private initBookOption() {
        const data = uni.getStorageSync("book-app-option");
        if (data) {
            utils.modifyData(this.bookOption, JSON.parse(data))
        }
    }

    /** 清除小说操作信息 */
    removeBookOption() {
        uni.removeStorageSync("book-app-option");
    }

}

/** 状态模块 */
const store = new ModuleStore();

export default store;