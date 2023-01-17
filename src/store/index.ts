import { modifyData } from "@/utils";
import { reactive } from "vue";
import ModuleAppOption from "./AppOption";
import ModuleUser from "./User";

// import { getIamgeByName } from "@/utils";
export class ModuleStore extends ModuleAppOption {
  constructor() {
    super();
    this.initBookOption();
  }

  /** 图片对象集 */
  get imageInfo() {
    // 需要用作背景图的可以用`import`引入
    return {
      iconWx: "/static/logo_wx.png",
      iconZfb: "/static/logo_zfb.png",
      logo: "/static/logo.png",
      defaultHead: "/static/default_head.png",
      noneData: "/static/none_data.png",
      iconArrowRight: "/static/arrow-right.png"
      // iconWx: getIamgeByName("logo_wx.png"),
      // iconZfb: getIamgeByName("logo_zfb.png"),
      // logo: getIamgeByName("logo.png"),
      // defaultHead: getIamgeByName("default_head.png"),
      // noneData: getIamgeByName("none_data.png"),
      // iconArrowRight: getIamgeByName("arrow-right.png")
    }
  }

  /** 用户状态 */
  readonly user = new ModuleUser();

  /** 小说操作信息 */
  readonly bookOption = reactive({
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
  })

  /** 保存小说操作信息 */
  saveBookOption() {
    uni.setStorageSync("book-app-option", JSON.stringify(this.bookOption));
  }

  /** 获取小说操作信息 */
  private initBookOption() {
    const data = uni.getStorageSync("book-app-option");
    if (data) {
      modifyData(this.bookOption, JSON.parse(data))
    }
  }

  /** 清除小说操作信息 */
  removeBookOption() {
    uni.removeStorageSync("book-app-option");
  }

}

/**
 * 状态管理模块
 * - `OOP`单例设计模式
 * - 参考 [你不需要`Vuex`](https://juejin.cn/post/6844903904023429128)
 */
const store = new ModuleStore();

export default store;