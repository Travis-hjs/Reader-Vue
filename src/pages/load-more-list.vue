<template>
  <view class="load-more-list">
    <view class="item card" v-for="item in loadMoreData.list" :key="item.id">
      <view class="id">{{ item.name }}</view>
      <image class="pic" mode="aspectFill" :src="item.img"></image>
      <view class="value">ID: {{ item.id }}</view>
    </view>
    <view style="height: 30vh" v-if="loadMoreData.list.length === 0"></view>
    <LoadMoreTip :info="loadMoreData" />
  </view>
</template>
<script lang="ts" setup>
import LoadMoreTip from "@/components/LoadMoreTip/index.vue";
import useLoadMore from "@/hooks/loadMore";
import { getTestList } from "@/api/common";
import { onLoad, onPullDownRefresh } from "@dcloudio/uni-app";

const { loadMoreData, setRequestListFn, refreshData } = useLoadMore();

// 方式一：
setRequestListFn(function () {
  return getTestList({
    id: 12,
    pageSize: loadMoreData.pageSize,
    currentPage: loadMoreData.currentPage,
  });
});

// 方式二：
// setRequestListFn(async function () {
//   const res = await getTestList({
//     id: 12,
//     pageSize: loadMoreData.pageSize,
//     currentPage: loadMoreData.currentPage,
//   });
//   if (res.code === 1) {
//     // 这里可以做接口数据请求回调处理
//   }
//   return res;
// });

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
.load-more-list {
  width: 100%;
  padding: 10px 10px 0;
  .item {
    width: 100%;
    padding: 10px;
    margin-bottom: 16px;
    .id {
      font-size: 18px;
      color: #3185f3;
      margin-bottom: 8px;
    }
    .value {
      font-size: 15px;
      color: #555;
    }
    .pic {
      width: 100%;
      height: 140px;
      margin-bottom: 10px;
    }
  }
}
</style>