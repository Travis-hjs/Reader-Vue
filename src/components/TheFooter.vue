<template>
  <view :class="['the-footer', isFixed ? 'fixed' : null]" :style="{ 'background': background, 'z-index': Number(zIndex) }">
    <slot></slot>
    <view :class="['spacing-box', appOption.isIPhoneX ? 'spacing-height' : null]"></view>
  </view>
</template>
<script lang="ts" setup>
import store from "@/store";

// =========== 兼容`iPhoneX`系列底部兼容处理组件 ===========

defineProps({
  /** 是否需要定位 */
  isFixed: {
    type: Boolean,
    default: true,
  },
  /** 定位层级 */
  zIndex: {
    type: [Number, String],
    default: 10,
  },
  /** 背景颜色 */
  background: {
    type: String,
    default: "transparent",
  },
});

const appOption = store.appOption;

</script>
<style lang="scss">
.the-footer {
  width: 100%;
  bottom: 0;
  left: 0;
  .spacing-box {
    width: 100%;
    height: constant(safe-area-inset-bottom);
    height: env(safe-area-inset-bottom);
  }
  .spacing-height {
    height: 34px;
  }
}
.the-footer.fixed {
  position: fixed;
}
</style>