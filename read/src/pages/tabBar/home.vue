<template>
    <view class="page home">
        <view class="list-item" v-for="item in list" :key="item.id">
            <book-item book-type="1" :book-data="item" />
        </view>
    </view>    
</template>

<script>
import BookItem from '../../components/BookItem';
import {
    createBookListData
} from '../../modules/createdata';

export default {
    components: {
        'book-item': BookItem
    },
    data() {
        return {
            list: createBookListData()
        }
    },
    onLoad() {
        
    },
    methods: {
        
    }
}
</script>

<style>
.home{ padding: 30rpx 30rpx 40rpx; }
.list-item{ margin-bottom: 30rpx; }
</style>