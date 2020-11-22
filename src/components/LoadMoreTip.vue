<template>
    <view class="load_more_tip flex fcenter fvertical">
        <view class="preloader" v-show="state == 'loading'">
            <view class="preloader-inner">
                <view class="preloader-inner-gap"></view>
                <view class="preloader-inner-left">
                    <view class="preloader-inner-half-circle"></view>
                </view>
                <view class="preloader-inner-right">
                    <view class="preloader-inner-half-circle"></view>
                </view>
            </view>
        </view>

        <view class="content" v-show="state == 'wait'" :style="{ 'padding-bottom':  paddingBottom + 'px' }">
            <view class="iconfont icon-arrow_up_fill"></view>
            <view class="text">上拉加载更多</view>
        </view>
        
        <view class="content" v-if="state == 'nomore'" style="padding-bottom: 10px;">
            <image class="nodata_img" :src="nodataImage" mode="aspectFill" />
            <view class="text">没有数据了</view>
        </view>
        
    </view>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { LoadMoreType } from "../utils/interfaces";
import store from "../store";

@Component({})
export default class LoadMoreTip extends Vue {
    @Prop({
        type: String,
        default: "wait"
    }) state!: LoadMoreType["state"]

     @Prop({
        type: [String, Number],
        default: ""
    }) paddingBottom!: string | number
    
    private nodataImage = store.images.none_data

}
</script>
<style lang="scss">
.load_more_tip{ 
    width: 100%; min-height: 180rpx; 
    .content{ 
        text-align: center; 
        .text{ font-size: 28rpx; color: #999; }
        .iconfont{ font-size: 48rpx; color: #999; margin-bottom: 4px; }
        .nodata_img{ width: 186rpx; height: 128rpx; margin: 0 auto 4px; }
    }
}
</style>