<template>
    <view class="load_more_tip flex fcenter fvertical">
        <view class="preloader" v-show="info.state === 'loading'">
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

        <view class="content" v-show="info.state === 'wait' && info.requestCount > 0" :style="{ 'padding-bottom':  paddingBottom + 'px' }">
            <view class="iconfont icon-arrow_up_fill"></view>
            <view class="text">上拉加载更多</view>
        </view>
        
        <view class="content nomore_box" v-show="info.state === 'nomore' && info.list.length == 0">
            <image class="nodata_img" :src="imageInfo.noneData" mode="aspectFill" />
            <view class="text">{{ noneDataText }}</view>
        </view>
        
        <view class="content nomore_box" v-show="info.state === 'nomore' && info.list.length > 0">
            <view class="text">{{ finishText }}</view>
        </view>
        
    </view>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { LoadMoreType } from "../utils/interfaces";
import store from "../store";

@Component({})
export default class LoadMoreTip extends Vue {
    readonly imageInfo = store.imageInfo

    @Prop({
        type: Object,
        default() {
            return {
                state: "wait",
                requestCount: 0,
                list: []
            }
        }
    })
    info!: LoadMoreType

    @Prop({
        type: String,
        default: "没有数据了"
    })
    noneDataText!: string

    @Prop({
        type: String,
        default: "数据已全部加载完"
    })
    finishText!: string

    @Prop({
        type: [String, Number],
        default: ""
    })
    paddingBottom!: string | number

}
</script>
<style lang="scss">
.load_more_tip{ 
    width: 100%; min-height: 180rpx; 
    .content { 
        text-align: center; 
        .text { font-size: 28rpx; color: #999; }
        .iconfont { font-size: 48rpx; color: #999; margin-bottom: 4px; }
        .nodata_img { width: 186rpx; height: 128rpx; margin: 0 auto 4px; }
    }
    .nomore_box { padding: 10px 0; }
}
</style>