class ModuleUtils{
    /**
     * 范围随机整数
     * @param {number} min 最小数
     * @param {number} max 最大数
     */
    ranInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * 随机生成中文
     * @param {number} min 
     * @param {number} max 
     */
    randomText(min, max) {
        const len = parseInt(Math.random() * max) + min;
        const base = 20000;
        const range = 1000;
        let str = '';
        let i = 0;
        while (i < len) {
            i++;
            const lower = parseInt(Math.random() * range);
            str += String.fromCharCode(base + lower);
        }
        return str;
    }

    /**
     * 打开其他应用
     * @param {'qq'|'wx'|'zfb'|'sina'|'taobao'} name 应用名
     * @param {(result: any) => void} callback 错误回调
     */
    openApp(name, callback) {
        // #ifdef APP-PLUS
        // learn: https://ask.dcloud.net.cn/article/35621
        const data = {
            qq: 'mqq://',
            wx: 'weixin://',
            zfb: 'alipay://',
            sina: 'sinaweibo://',
            taobao: 'taobao://',
        }
        plus.runtime.openURL(data[name], callback);
        // #endif
    }
    
    /**
     * 从底部显示提示
     * @param {string} tip 
     */
    showToastBottom(tip) {
        uni.showToast({
            title: tip,
            // icon: 'none',
            position: 'bottom'
        });
    }
}

/** 工具类模块 */
const utils = new ModuleUtils();

export default utils;