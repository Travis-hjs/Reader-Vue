<template>
    <view class="load_more_list">
        <view class="item card" v-for="item in loadMoreData.list" :key="item.id">
            <view class="id">{{ item.id }}.</view>
            <image class="pic" mode="aspectFill" :src="item.img"></image>
            <view class="value">{{ item.value }}</view>
        </view>
        <view style="height: 30vh" v-if="loadMoreData.list.length === 0"></view>
        <LoadMoreTip :state="loadMoreData.state" />
    </view>
</template>
<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import LoadMore from "../mixins/LoadMore";
import LoadMoreTip from "../components/LoadMoreTip.vue";
import api from "../api";
import { ApiListData } from "../utils/interfaces";

@Component({
    components: {
        LoadMoreTip
    }
})
export default class LoadMoreList extends LoadMore {

    getListCallback(res: ApiListData) {
        console.log("获取数据之后的回调", res);
    }

    requestList() {
        return api.getTestList({
            pageIndex: this.loadMoreData.pageIndex,
            pageSize: this.loadMoreData.pageSize
        })
    }

    /**
     * 监听用户下拉动作
     * - 需要在 `pages.json` 的页面配置中开启 `enablePullDownRefresh` 。
     * - 可以通过 `uni.startPullDownRefresh` 触发下拉刷新，调用后触发下拉刷新动画，效果与用户手动下拉刷新一致。
     * - 当处理完数据刷新后，`uni.stopPullDownRefresh` 可以停止当前页面的下拉刷新。
     */
    onPullDownRefresh() {
        this.resetListData();
        this.getListData(() => {
            uni.stopPullDownRefresh();
        });
    }

    onLoad() {
        this.getListData();
    }
}
</script>
<style lang="scss">
.load_more_list{
    width: 100%;
    padding: 10px 10px 0;
    .item{
        width: 100%;
        padding: 10px;
        margin-bottom: 16px;
        .id{ font-size: 18px; color: #3185f3; margin-bottom: 8px; }
        .value{ font-size: 15px; color: #555; }
        .pic{ 
            width: 100%; 
            height: 140px;
            margin-bottom: 10px; 
        }
    }
}
</style>