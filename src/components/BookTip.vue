<template>
    <view class="book_tip" @click="theClick()">
        <view class="item_tip">
            <view class="tip_content">
                <Icons type="arrowthinleft" size="30" color="#fff" />
                <view class="tip_box"></view>
                <view class="tip_text">点击切换到上一页</view>
            </view>
        </view>
        <view class="item_tip">
            <view class="tip_content">
                <Icons type="settings" size="30" color="#fff" />
                <view class="tip_box"></view>
                <view class="tip_text">点击换出菜单</view>
            </view>
        </view>
        <view class="item_tip">
            <view class="tip_content">
                <Icons type="arrowthinright" size="30" color="#fff" />
                <view class="tip_box"></view>
                <view class="tip_text">点击切换到下一页</view>
            </view>
        </view>
    </view>    
</template>

<script lang="ts">
import Icons from './Icons.vue';
import { Component, Vue } from "vue-property-decorator";

@Component({
    components: {
        Icons
    }
})
export default class BookTip extends Vue {
    theClick() {
        this.$emit("click");
    }
}
</script>

<style lang="scss">
.book_tip{ 
    width: 100%; min-height: 100vh; box-sizing: border-box; position: fixed; top: 0; left: 0; z-index: 10; display: flex; flex-wrap: wrap; 
    .item_tip{ flex: 1; height: 100vh; background-color: rgba(0,0,0,0.5); display: flex; }
    .item_tip:nth-child(2){ background-color: rgba(0,0,0,0.4); }
    .tip_content{ 
        margin: auto; text-align: center; opacity: 0.8; 
        .tip_box{ height: 30rpx; }
        .tip_text{ font-size: 28rpx; color: #fff; }
    }
}
</style> 