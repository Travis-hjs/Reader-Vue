class ModuleGlobal {
    icon = {
        /** 金币 */
        gold: '/static/gold.png',
        /** 红包 */
        redpack: '/static/redpack.png',
        /** 微信logo */
        logo_wx: '/static/logo_wx.png',
        /** 支付宝logo */
        logo_zfb: '/static/logo_zfb.png',
        /** 签到icon */
        sign_in: '/static/icon_signin.png',
        /** 暂无数据 */
        none_data: '/static/none_data.png',
    }
    images = {
        /** 默认头像 */
        head: '/static/default_head.png',
        qd: '/static/qd.png',
        golds: '/static/golds.png',
        book1: '/static/book_1.png',
        book2: '/static/book_2.png',
        invite_bg: '/static/invite_bg.png',
        invite_btn: '/static/invite_btn.png',
        invite_item: '/static/invite_item.png',
        invite_list_bg: '/static/invite_list_bg.png',
        invite_list_item: '/static/invite_list_item.png',
        invite_list_item_long: '/static/invite_list_item_long.png',
    }

    /** `APP`操作信息 */
    AppOption = {
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

    /** 保存`APP`操作信息 */
    saveAppOption() {
        uni.setStorageSync('app-option', JSON.stringify(this.AppOption));
    }

    /** 获取`APP`操作信息 */
    fetchAppOption() {
        const data = JSON.parse((uni.getStorageSync('app-option') || '{}'));
        this.AppOption.theme = data['theme'] || 1;
        this.AppOption.first = data['first'] === false ? false : true;
        this.AppOption.sizeInfo = data['sizeInfo'] || this.AppOption.sizeInfo;
        return data;
    }

    /** 清除`APP`操作信息 */
    removeAppOption() {
        uni.removeStorageSync('app-option');
    }

}

/** 全局模块 */
const Global = new ModuleGlobal();

export default Global;