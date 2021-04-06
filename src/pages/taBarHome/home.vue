<template>
    <view class="home">
        <view class="list-item" v-for="item in loadMoreData.list" :key="item.id">
            <BookItem bookType="1" :bookData="item" />
        </view>
        <view style="height: 30vh" v-if="loadMoreData.list.length === 0"></view>
        <LoadMoreTip :info="loadMoreData" />
    </view>    
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import BookItem from "../../components/BookItem.vue"
import LoadMoreTip from "../../components/LoadMoreTip.vue";
import LoadMore from "../../mixins/LoadMore";
import { getBookList } from "../../api/common";
import { ApiListData } from "../../utils/interfaces";

@Component({
    components: {
        BookItem,
        LoadMoreTip
    }
})
export default class HomePage extends LoadMore {

    getListCallback(res: ApiListData) {
        console.log("小说列表数据 >>", res);
    }

    requestList() {
        return getBookList({
            pageIndex: this.loadMoreData.pageIndex,
            pageSize: this.loadMoreData.pageSize
        })
    }

    onPullDownRefresh() {
        this.refreshData(() => {
            uni.stopPullDownRefresh();
        });
    }

    onLoad() {
        this.getListData();
    }
}
</script>

<style lang="scss">
.home{ 
    padding: 30rpx 30rpx 40rpx;
    .list-item{ margin-bottom: 30rpx; }
}

</style>