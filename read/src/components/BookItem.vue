<template>
    <view class="book-item" @click="openDetails">
        <!-- 一行 2 个布局 -->
        <view class="book gird_2" v-if="bookType == '2'">
            <image class="book_img" mode="aspectFill" :src="bookData.thumb" />
            <view :class="['index', bookData.index < 3 ? 'index_on':'']">{{ bookData.index + 1 }}</view>
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

<script>
import {
    createBookInfo
} from '../modules/createdata';

export default {
    props: {
        bookType: {
            type: String,
            default: '0'
        },
        /**
         * @type {createBookInfo()}
         */
        bookData: {
            type: Object,
            default() {
                return createBookInfo();
            }
        },
        openType: {
            type: String,
            default: '1'
        }
    },
    data() {
        return {

        }
    },
    methods: {
        /**
         * 跳转详情
        */
        openDetails() {
            uni.showToast({
                title: `小说id: ${this.bookData.id}`,
                icon: 'none'
            });
            if (this.openType == '2') {
                uni.navigateTo({
                    url: '/pages/book-2?id=' + this.bookData.id
                });
            } else {
                uni.navigateTo({
                    url: '/pages/book?id=' + this.bookData.id
                });
            }
        }
    }
}
</script>

<style scoped>
image{ will-change: transform }
.book-item { width: 100%;height: 100%;}
/* .book-item:active{ opacity: 0.5; } */
.book-item .book{ width: 100%; }
.gird_2{ display: flex; }
.gird_2 .book_img { width: 90rpx; height: 150rpx; background-color: #999; }
.gird_2 .index { font-size: 32rpx; color: #000; margin: 0 20rpx; padding-top: 12rpx; }
.gird_2 .index_on { color: goldenrod; }
.gird_2 .book_content { flex: 1; overflow: hidden; padding: 12rpx 0; }
.gird_2 .book_content .book_title { color: #000; font-size: 28rpx; line-height: 40rpx; height: 80rpx; margin-bottom: 8rpx; }
.gird_2 .book_content .book_dec { color: #666; font-size: 24rpx; }

.gird_1{ display: flex; }
.gird_1 .book_img{ width: 140rpx; height: 200rpx; margin-right: 20rpx; }
.gird_1 .book_content { flex: 1; overflow: hidden; }
.gird_1 .book_title_box{ display: flex; align-items: center; width: 100%; height: 90rpx; overflow: hidden; }
.gird_1 .book_title{ font-size: 32rpx; color: #000; flex: 1; }
.gird_1 .score{ font-size: 32rpx; color: #f47b36; margin-left: 10rpx; }
.gird_1 .book_dec{ color: #666; font-size: 28rpx; margin-bottom: 10rpx; }
.gird_1 .book_label{ color: #666; font-size: 28rpx; }

.gird_4 .book_img{ width: 100%; max-width: 200rpx; height: 210rpx; }
.gird_4 .book_title{ font-size: 28rpx; line-height: 38rpx; height: 76rpx; color: #000; margin-bottom: 10rpx; }
.gird_4 .score{ font-size: 28rpx; color: #f47b36; }

.item_rank { width: 100%; display: flex; flex-wrap: wrap; align-items: center; }
.item_rank .index{ font-size: 32rpx; color: #000; font-weight: bold; width: 60rpx; text-align: center; }
.item_rank .book_img{ width: 150rpx; height: 200rpx; margin: 0 20rpx; border-radius: 8rpx; }
.item_rank .book_content{ flex: 1; overflow: hidden; }
.item_rank .book_title{ font-size: 32rpx; line-height: 40rpx; height: 80rpx; color: #000; margin-bottom: 30rpx; }
.item_rank .book_label{ font-size: 28rpx; color: #666; margin-bottom: 10rpx; }
.item_rank .book_dec{ color: #d3b497; font-size: 28rpx; }
</style>