import ModuleAppOption from "./AppOption";
import { 
    DeepPartial,
    UserInfoType 
} from "../utils/interfaces";

const cacheName = "user-info";

export class StoreUserInfo extends ModuleAppOption {
    
    constructor() {
        super()
        this.initBookAppOption()
    }

    readonly icon = {
        /** 微信logo */
        logo_wx: "/static/logo_wx.png",
        /** 支付宝logo */
        logo_zfb: "/static/logo_zfb.png",
    }

    readonly images = {
        logo: "/static/logo.png",
        /** 默认头像 */
        default_head: "/static/default_head.png",
        /** 暂无数据 */
        none_data: "/static/none_data.png",
    }

    /** 用户信息 */
    readonly userInfo: UserInfoType = {
        id: "",
        token: "",
        phone: ""
    }

    /**
     * 更新用户信息字段
     * @param value 
     */
    updateUserInfo(value: DeepPartial<UserInfoType>) {
        this.modifyData(this.userInfo, value);
        uni.setStorageSync(cacheName, JSON.stringify(this.userInfo));
    }

    /** 初始化用户数据（从本地获取） */
    initUserInfo() {
        const data = uni.getStorageSync(cacheName);
        if (data) {
            this.updateUserInfo(JSON.parse(data));
        }
    }

    /** 小说`APP`操作信息 */
    readonly bookAppOption = {
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

    /** 保存小说`APP`操作信息 */
    saveBookAppOption() {
        uni.setStorageSync("book-app-option", JSON.stringify(this.bookAppOption));
    }

    /** 获取小说`APP`操作信息 */
    private initBookAppOption() {
        const data = uni.getStorageSync("book-app-option");
        if (data) {
            this.modifyData(this.bookAppOption, JSON.parse(data))
        }
    }

    /** 清除小说`APP`操作信息 */
    removeBookAppOption() {
        uni.removeStorageSync("book-app-option");
    }

}

/** 状态模块 */
const store = new StoreUserInfo();

export default store;