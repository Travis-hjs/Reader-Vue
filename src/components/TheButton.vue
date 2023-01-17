<template>
  <button 
    :class="['the-button', { 'isdisabled': disabled || loading }]"
    :style="{ 'background': color, 'height': height + 'rpx', 'color': textColor, 'border-radius': radius }"
    :disabled="disabled || loading"
    @click="onClick()"
  >
    <view :class="['loading-icon', { 'loading-icon-hide': !loading }]" :style="{ 'border-top-color': textColor }"></view>
    <slot></slot>
  </button>
</template>
<script lang="ts" setup>
import { computed } from "vue";

// =========== 自定义按钮 ===========

const emit = defineEmits(["click"]);

const props = defineProps({
  /** 按钮颜色 */
  color: { type: String, default: "#40a9ff" },
  /** 按钮文字颜色 */
  textColor: { type: String, default: "#fff" },
  /** 按钮高度`rpx` */
  height: { type: Number, default: 90 },
  /** 是否圆角按钮 */
  round: { type: Boolean, default: false },
  /** 加载状态 */
  loading: { type: Boolean, default: false },
  /** 是否禁用状态 */
  disabled: { type: Boolean, default: false },
})

const radius = computed(function () {
  let value = "2px";
  if (props.round) {
    value = `${props.height / 2}rpx`;
  }
  return value;
});

function onClick() {
  emit("click");
}

</script>
<style lang="scss">
$time: 0.3s all;

.the-button {
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  font-weight: 500;
  font-size: 32rpx;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.05);
  transition: $time;
  .loading-icon {
    width: 40rpx;
    height: 40rpx;
    border-radius: 50%;
    border: solid 2px transparent;
    // border-top-color: #fff;
    // border-right-color: #fff;
    margin-right: 16rpx;
    transform: scale(1);
    animation: btnLoading 1s infinite linear;
    transition: $time;
  }
  .loading-icon-hide {
    width: 0px;
    height: 0px;
    margin-right: 0px;
    border-width: 0px;
    opacity: 0;
    visibility: hidden;
  }
}
.the-button.isdisabled {
  opacity: 0.8;
}

@keyframes btnLoading {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>