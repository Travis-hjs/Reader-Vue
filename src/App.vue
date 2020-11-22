<script lang="ts">
import Vue from "vue";
import store from "./store";

export default Vue.extend({
    mpType: "app",
    onLaunch() {
        console.log("【App Launch】")
        store.initAppOption();
        store.initUserInfo();
    },
    onShow() {
        console.log("【App Show】")
    },
    onHide() {
        console.log("【App Hide】")
    }
});
</script>

<style lang="scss">
/* 每个页面公共样式，variable 和 mixins 这些在 uni.scss 中全局引用 */
@import "./styles/global.scss";
@import "./styles/loading.scss";
</style>
