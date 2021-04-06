<template>
    <view :class="['the_footer', isFixed ? 'fixed' : null]" :style="{ 'background': background, 'z-index': zIndex }">
        <slot></slot>
        <view :class="['spacing_box', appOption.isIPhoneX ? 'spacing_height' : null]"></view>
    </view>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import store from "../store";

/** 兼容`iPhoneX`系列底部兼容处理组件 */
@Component({})
export default class TheFooter extends Vue {
    /** 是否需要定位 */
    @Prop({
        type: Boolean,
        default: true
    })
    isFixed!: boolean

    /** 定位层级 */
    @Prop({
        type: [Number, String],
        default: 10
    })
    zIndex!: number | string

    /** 背景颜色 */
    @Prop({
        type: String,
        default: "transparent"
    })
    background!: string

    appOption = store.appOption
}
</script>
<style lang="scss">
.the_footer {
    width: 100%;
    bottom: 0;
    left: 0;
    .spacing_box {
        width: 100%;
        height: constant(safe-area-inset-bottom);
        height: env(safe-area-inset-bottom);
    }
    .spacing_height {
        height: 34px;
    }
}
.the_footer.fixed {
    position: fixed;
}
</style>