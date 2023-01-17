<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import store from "./store";
import { version } from "../package.json";
// #ifdef H5
window.version = version;
// #endif

onLaunch(function () {
  console.log(`%c version >> ${version}`, "background-color: #13ce66; padding: 2px 6px; color: #fff; border-radius: 2px");
  console.log("App Launch");
  store.initAppOption();
});

onShow(function () {
  console.log("App Show");
});

onHide(function () {
  console.log("App Hide");
});
</script>
<style lang="scss">
/* 每个页面公共样式，variable 和 mixins 这些在 uni.scss 中全局引用 */
@import "./styles/index.scss";
@import "./styles/loading.scss";
/* 去除滚动条样式 */
::-webkit-scrollbar {
  display: none;
}
</style>
