# 触底加载更多组件

使用示例

```html
<template>
  <view>
    <view v-for="(item, index) in loadMoreData.list" :key="index">列表-item</view>
    <LoadMoreTip :info="loadMoreData" />
  </view>
</template>
<script lang="ts" setup>
import LoadMoreTip from "@/components/LoadMoreTip/index.vue";
import useLoadMore from "@/hooks/loadMore";
import { getTestList } from "@/api/common";
import { onLoad } from "@dcloudio/uni-app";

const { loadMoreData, setRequestListFn, refreshData } = useLoadMore();

// 方式一：
setRequestListFn(function () {
  return getTestList({
    id: 12,
    pageSize: loadMoreData.pageSize,
    currentPage: loadMoreData.currentPage
  })
});

// 方式二：
// setRequestListFn(async function () {
//   const res = await getTestList({
//     id: 12,
//     pageSize: loadMoreData.pageSize,
//     currentPage: loadMoreData.currentPage
//   })
//   if (res.code === 1) {
//     // 这里可以做接口数据请求回调处理
//   }
//   return res;
// });

onLoad(function () {
  refreshData();
})

/** 主动点击刷新数据 */
function onClickRefresh() {
  refreshData(function () {
    console.log("请求数据回调 >>", loadMoreData.list);
  });
}
</script>
```
