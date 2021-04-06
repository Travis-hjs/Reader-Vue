<template>
    <button 
        :class="['the_button', { 'isdisabled': disabled || loading }]"
        :style="{ 'background': color, 'height': height + 'rpx', 'color': textColor, 'border-radius': radius }"
        :disabled="disabled || loading"
        @click="onClick()"
    >
        <view :class="['loading_icon', { 'loading_icon_hide': !loading }]" :style="{ 'border-top-color': textColor }"></view>
        <slot></slot>
    </button>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

/** 自定义按钮，包含 loading、disabled 等状态 */
@Component({})
export default class TheButton extends Vue {
    /** 按钮颜色 */
    @Prop({ type: String, default: "#40a9ff" })
    color!: string;

    /** 按钮颜色 */
    @Prop({ type: String, default: "#fff" })
    textColor!: string;

    /** 按钮高度`rpx` */
    @Prop({ type: Number, default: 90 })
    height!: number;

    /** 是否圆角按钮 */
    @Prop({ type: Boolean, default: false })
    round!: boolean;

    /** 加载状态 */
    @Prop({ type: Boolean, default: false })
    loading!: boolean;

    /** 是否禁用状态 */
    @Prop({ type: Boolean, default: false })
    disabled!: boolean;

    get radius() {
        let value = "2px";
        if (this.round) {
            value = `${this.height / 2}rpx`;
        }
        return value;
    }

    onClick() {
        this.$emit("click");
    }
}
</script>
<style lang="scss">
$time: 0.3s all;

.the_button {
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
    .loading_icon {
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
    .loading_icon_hide {
        // width: 0;
        // height: 0;
        margin-right: 0;
        opacity: 0;
        visibility: hidden;
    }
}
.the_button.isdisabled {
    opacity: 0.8;
}

@keyframes btnLoading {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>