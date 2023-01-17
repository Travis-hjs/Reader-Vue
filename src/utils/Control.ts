import { nextTick } from "vue";

// ========================= 控件模块 =========================

/**
 * 打开其他应用
 * @param name 应用名
 * @param callback 错误回调
 */
export function openApp(name: "qq" | "wx" | "zfb" | "sina" | "taobao", callback?: (result: any) => void) {
  // #ifdef APP-PLUS
  // learn: https://ask.dcloud.net.cn/article/35621
  const data = {
    qq: "mqq://",
    wx: "weixin://",
    zfb: "alipay://",
    sina: "sinaweibo://",
    taobao: "taobao://",
  }
  plus.runtime.openURL(data[name], callback);
  // #endif
}

/**
 * 显示加载提示
 * @param text 提示文字
 */
export function showLoading(text: string = "加载中..") {
  uni.showLoading({
    title: text,
    mask: true
  });
}

/**
 * 显示提示条
 * @param tip 提示文字
 * @param duration 持续时间
 */
export function showToast(tip: string, duration = 2000) {
  uni.showToast({
    title: tip,
    // position: "bottom",
    icon: "none",
    duration: duration,
    // image: src
  });
}

/**
 * 显示提示框
 * @param content 提示的内容 
 * @param success 确认回调 
 * @param title 提示标题 
 */
export function showAlert(content: string, success?: (res: UniApp.ShowModalRes) => void, title: string = "操作提示") {
  uni.showModal({
    title: title,
    content: content,
    showCancel: false,
    success: success
  })
}

interface ShowConfirmOptions {
  /** 内容 */
  content: string
  /** 标题 */
  title?: string
  /** 确认回调 */
  confirm?(): void
  /** 取消回调 */
  cancel?(): void
  /** 确认按钮文字 */
  confirmText?: string
  /** 取消按钮文字，超过4个中文会报错 */
  cancelText: string
}

/**
 * 确认弹窗
 * @param options 传参对象
 */
export function showConfirm(options: ShowConfirmOptions) {
  uni.showModal({
    title: options.title || "操作提示",
    content: options.content,
    showCancel: true,
    confirmText: options.confirmText || "确认",
    cancelText: options.cancelText || "取消",
    success(res) {
      if (res.confirm) {
        options.confirm && options.confirm();
      } else if (res.cancel) {
        options.cancel && options.cancel();
      }
    },
  });
}

/**
 * 复制文本
 * @param value 复制的内容 
 * @param success 成功回调
 */
export function copyText(value: string, success?: () => void) {
  value = value.replace(/(^\s*)|(\s*$)/g, "");
  if (!value) {
    return showToast("复制的内容不能为空！");
  }

  // #ifndef H5
  uni.setClipboardData({
    data: value,
    success() {
      showToast("复制成功");
      success && success();
    }
  });
  // #endif

  // #ifdef H5
  const id = "the-clipboard";
  let clipboard = document.getElementById(id) as HTMLTextAreaElement;
  if (!clipboard) {
    clipboard = document.createElement("textarea");
    clipboard.id = id;
    clipboard.readOnly = true;
    clipboard.style.cssText = "font-size: 15px; position: fixed; top: -1000%; left: -1000%;";
    document.body.appendChild(clipboard);
  }
  clipboard.value = value;
  clipboard.select();
  clipboard.setSelectionRange(0, clipboard.value.length);
  const state = document.execCommand("copy");
  if (state) {
    showToast("复制成功");
    success && success();
  } else {
    showToast("复制失败");
  }
  // #endif
}

interface ScrollviewCenterOptions<T = any> {
  /**
   * 当前实例
   * ```js
   * import { getCurrentInstance } from "vue";
   * getCurrentInstance();
   * ```
   */
  ctx: T,
  /** 要滚动的目标节点`id` */
  id: string
  /** `<scrollview>`的宽度，默认是屏幕宽度 */
  wrapWidth?: number
  /** 点击事件 */
  event?: Event
  /** 是否主动设置偏移到中心位置，设置值时，`event`不需要传入 */
  scrollValue?: number
  /** 回调 */
  callback?: (left: number, info: UniApp.NodeInfo) => void
}

/**
 * 监听`<scrollview>`组件指定元素滚动到视图中心的偏移值
 * @param option 配置参数
 */
export function onScrollviewCenter(option: ScrollviewCenterOptions) {
  const width = option.wrapWidth || uni.getSystemInfoSync().windowWidth;
  nextTick(function () {
    const node = uni.createSelectorQuery().in(option.ctx).select(`#${option.id}`);
    const left = option.event ? (option.event.currentTarget as any).offsetLeft : 0;
    node.boundingClientRect(function (nodeInfo) {
      let result = 0;
      if (nodeInfo && !Array.isArray(nodeInfo)) {
        if (typeof option.scrollValue === "number") {
          result = option.scrollValue + nodeInfo.left! + nodeInfo.width! / 2 - width / 2;
        } else {
          result = left + nodeInfo.width! / 2 - width / 2;
        }
      }
      typeof option.callback === "function" && option.callback(result, nodeInfo as any);
    }).exec();
  });
}
