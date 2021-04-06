<template>
    <view class="details">
        <button class="button_pink goback_btn" :style="{ 'top': appOption.statusBarHeight + 10 + 'px' }" @click="goback">返回上一页</button>
        <view class="box" :style="{ 'padding-top': appOption.statusBarHeight + 90 + 'px' }">
            <view>页面参数{{ pageParam }}</view>
        </view>
        <TheFooter background="#222">
            <view class="button_dark footer flex fvertical fcenter">
                <view>footer</view>
            </view>
        </TheFooter>
    </view>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TheFooter from "../components/TheFooter.vue"
import store from "../store";
import { searchUserType } from "../api/common";

@Component({
    components: {
        TheFooter
    }
})
export default class DetailsPage extends Vue {
    appOption = store.appOption
    /** 页面传参接收数据 */
    pageParam = ""

    onLoad(param: any) {
        this.pageParam = JSON.stringify(param);
        console.log("appOption", store.appOption);
    }

    goback() {
        uni.navigateBack({});
    }
    
    getUserType() {
        searchUserType("vip").then(res => {
            console.log(res);
            
        })
    }
}
</script>

<style lang="scss">
.details{
    .goback_btn{ width: 300rpx; position: fixed; left: 20rpx; }
    .box{ width: 100%; height: 300vh; }
    .footer { width: 100%; }
}

</style>