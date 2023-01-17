<template>
  <view class="home">
    <view class="list-item" v-for="item in loadMoreData.list" :key="item.id">
      <BookItem bookType="1" :bookData="item" />
    </view>
    <view style="height: 30vh" v-if="loadMoreData.list.length === 0"></view>
    <LoadMoreTip :info="loadMoreData" />
  </view>
</template>
<script lang="ts" setup>
import { getBookList } from "@/api/common";
import BookItem from "@/components/BookItem.vue";
import LoadMoreTip from "@/components/LoadMoreTip/index.vue";
import useLoadMore from "@/hooks/loadMore";
import { onLoad, onPullDownRefresh } from "@dcloudio/uni-app";

const { loadMoreData, setRequestListFn, refreshData } = useLoadMore();

setRequestListFn(function () {
  return getBookList({
    pageSize: loadMoreData.pageSize,
    currentPage: loadMoreData.currentPage,
  });
});

onLoad(function () {
  refreshData();
});

onPullDownRefresh(function () {
  refreshData(() => {
    uni.stopPullDownRefresh();
  });
});

</script>
<style lang="scss">
.home{ 
  padding: 30rpx 30rpx 40rpx;
  .list-item {
    margin-bottom: 30rpx;
  }
}
</style>