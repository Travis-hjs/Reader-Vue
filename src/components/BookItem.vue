<template>
  <view class="book-item" @click="openDetails">
    <!-- 一行 2 个布局 -->
    <view class="book gird_2" v-if="bookType == '2'">
      <image class="book_img" mode="aspectFill" :src="bookData.thumb" />
      <view :class="['index', bookData.index < 3 ? 'index_on' : '']">{{ bookData.index + 1 }}</view>
      <view class="book_content">
        <view class="book_title ellipsis-2">{{ bookData.name }}</view>
        <view class="book_dec ellipsis-2">{{ bookData.info }}</view>
      </view>
    </view>

    <!-- 一行 1 个布局-->
    <view class="book gird_1" v-else-if="bookType == '1'">
      <image class="book_img" mode="aspectFill" :src="bookData.thumb" />
      <view class="book_content">
        <view class="book_title_box">
          <view class="book_title ellipsis">{{ bookData.name }}</view>
          <view class="score">{{ bookData.score }} 分</view>
        </view>
        <view class="book_dec ellipsis">{{ bookData.info }}</view>
        <view class="book_label ellipsis">{{ bookData.label }}</view>
      </view>
    </view>

    <!-- 一行 4 个布局 -->
    <view class="book gird_4" v-else-if="bookType == '4'">
      <image class="book_img" mode="aspectFill" :src="bookData.thumb" />
      <view class="book_title ellipsis-2">{{ bookData.name }}</view>
      <view class="score">{{ bookData.score }} 分</view>
    </view>

    <!-- 榜单 item 布局 -->
    <view class="book item_rank" v-else-if="bookType == 'rank'">
      <view class="index">{{ bookData.index + 1 }}</view>
      <image class="book_img" mode="aspectFill" :src="bookData.thumb" />
      <view class="book_content">
        <view class="book_title ellipsis-2">{{ bookData.name }}</view>
        <view class="book_label ellipsis">{{ bookData.label }}</view>
        <view class="book_dec ellipsis">{{ bookData.value }}</view>
      </view>
    </view>

  </view>
</template>
<script lang="ts" setup>
import { PropType } from "vue";
import { showToast } from "@/utils/control";
import { BookInfo, createBookInfo } from "@/hooks/book";

const props = defineProps({
  bookType: {
    type: String as PropType<"1"|"2"|"3"|"4"|"rank">,
    default: "0"
  },
  bookData: {
    type: Object as PropType<BookInfo>,
    default() {
        return createBookInfo();
    }
  }
});

/**
 * 跳转详情
 */
function openDetails() {
  showToast("小说id " + props.bookData.id)
  uni.navigateTo({
    url: "/pages/book?id=" + props.bookData.id
  });
}
</script>
<style lang="scss" scoped>
image { will-change: transform }
.book-item {
    width: 100%;height: 100%;
    .book{ width: 100%; }
}
/* .book-item:active{ opacity: 0.5; } */

.gird_2{ 
    display: flex; 
    .book_img { width: 90rpx; height: 150rpx; background-color: #999; }
    .index { font-size: 32rpx; color: #000; margin: 0 20rpx; padding-top: 12rpx; }
    .index_on { color: goldenrod; }
    .book_content { 
        flex: 1; overflow: hidden; padding: 12rpx 0; 
        .book_title { color: #000; font-size: 28rpx; line-height: 40rpx; height: 80rpx; margin-bottom: 8rpx; }
        .book_dec { color: #666; font-size: 24rpx; }
    }
}

.gird_1{ 
    display: flex; 
    .book_img{ width: 140rpx; height: 200rpx; margin-right: 20rpx; }
    .book_content { flex: 1; overflow: hidden; }
    .book_title_box{ display: flex; align-items: center; width: 100%; height: 90rpx; overflow: hidden; }
    .book_title{ font-size: 32rpx; color: #000; flex: 1; }
    .score{ font-size: 32rpx; color: #f47b36; margin-left: 10rpx; }
    .book_dec{ color: #666; font-size: 28rpx; margin-bottom: 10rpx; }
    .book_label{ color: #666; font-size: 28rpx; }
}

.gird_4 {
    .book_img{ width: 100%; max-width: 200rpx; height: 210rpx; }
    .book_title{ font-size: 28rpx; line-height: 38rpx; height: 76rpx; color: #000; margin-bottom: 10rpx; }
    .score{ font-size: 28rpx; color: #f47b36; }
}

.item_rank { 
    width: 100%; display: flex; flex-wrap: wrap; align-items: center; 
    .index{ font-size: 32rpx; color: #000; font-weight: bold; width: 60rpx; text-align: center; }
    .book_img{ width: 150rpx; height: 200rpx; margin: 0 20rpx; border-radius: 8rpx; }
    .book_content{ flex: 1; overflow: hidden; }
    .book_title{ font-size: 32rpx; line-height: 40rpx; height: 80rpx; color: #000; margin-bottom: 30rpx; }
    .book_label{ font-size: 28rpx; color: #666; margin-bottom: 10rpx; }
    .book_dec{ color: #d3b497; font-size: 28rpx; }
}
</style>