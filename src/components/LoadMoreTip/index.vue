<template>
  <view class="load-more-tip fvc">
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

    <view class="content nomore-box" v-show="info.state === 'nomore' && info.list.length == 0">
      <image class="nodata-img" :src="imageInfo.noneData" mode="aspectFill" />
      <view class="text">{{ noneDataText }}</view>
    </view>

    <view class="content nomore-box" v-show="info.state === 'nomore' && info.list.length > 0">
      <view class="text">{{ finishText }}</view>
    </view>

  </view>
</template>
<script lang="ts">
/** 加载更多数据底部提示组件 */
export default defineComponent({
  name: "LoadMoreTip"
})
</script>
<script lang="ts" setup>
import { defineComponent, PropType } from "vue";
import { LoadMoreInfo, useLoadMoreData } from "@/hooks/loadMore";
import store from "@/store";

defineProps({
  info: {
    type: Object as PropType<LoadMoreInfo>,
    default() {
      return useLoadMoreData();
    },
  },
  noneDataText: {
    type: String,
    default: "没有数据了",
  },
  finishText: {
    type: String,
    default: "数据已全部加载完",
  },
  paddingBottom: {
    type: [String, Number],
    default: "",
  },
});

const imageInfo = store.imageInfo;

</script>
<style lang="scss">
.load-more-tip {
  width: 100%;
  min-height: 180rpx;
  .content {
    text-align: center;
    .text {
      font-size: 28rpx;
      color: #999;
    }
    .iconfont {
      font-size: 48rpx;
      color: #999;
      margin-bottom: 4px;
    }
    .nodata-img {
      width: 186rpx;
      height: 128rpx;
      margin: 0 auto 4px;
    }
  }
  .nomore-box {
    padding: 10px 0;
  }
}
</style>