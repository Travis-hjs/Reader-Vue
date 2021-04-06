import { 
    ShowConfirmOptions 
} from "./interfaces";

/** 控件模块 */
export default class ModuleControl {

    /**
     * 打开其他应用
     * @param name 应用名
     * @param callback 错误回调
     */
    openApp(name: "qq"|"wx"|"zfb"|"sina"|"taobao", callback?: (result: any) => void) {
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
    showLoading(text: string = "加载中..") {
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
    showToast(tip: string, duration = 2000) {
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
    showAlert(content: string, success?: (res: UniApp.ShowModalRes) => void, title: string = "操作提示") {
        uni.showModal({
            title: title,
            content: content,
            showCancel: false,
            success: success
        })
    }

    /**
     * 确认弹窗
     * @param options 传参对象
     */
    showConfirm(options: ShowConfirmOptions) {
        uni.showModal({
            title: options.title || "操作提示",
            content: options.content,
            showCancel: true,
            confirmText: options.text || "确认",
            success(res) {
                if (res.confirm) {
                    options.callback && options.callback();
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
    copyText(value: string, success?: () => void) {
        value = value.replace(/(^\s*)|(\s*$)/g, "");
        if (!value) {
            return this.showToast("复制的内容不能为空！");
        }

        // #ifndef H5
        const THAT = this;
        uni.setClipboardData({
            data: value,
            success() {
                THAT.showToast("复制成功");
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
          this.showToast("复制成功");
          success && success();
        } else {
          this.showToast("复制失败");
        }
        // #endif
    }
    
}