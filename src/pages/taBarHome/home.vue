<template>
    <view class="home">
        <view class="list-item" v-for="item in list" :key="item.id">
            <BookItem bookType="1" :bookData="item" />
        </view>   
    </view>    
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import BookItem from "../../components/BookItem.vue"
import {
    createBookListData
} from "../../utils/createBookData"

@Component({
    components: {
        BookItem
    }
})
export default class HomePage extends Vue {

    private list = createBookListData(0, 0);

    onLoad() {
        this.list = createBookListData();
    }
}
</script>

<style lang="scss">
.home{ 
    padding: 30rpx 30rpx 40rpx;
    .list-item{ margin-bottom: 30rpx; }
}

</style>