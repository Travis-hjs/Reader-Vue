<template>
    <view class="details">
        <button class="button_pink goback_btn" :style="{ 'top': appOption.statusBarHeight + 10 + 'px' }" @click="goback">返回上一页</button>
        <view class="box" :style="{ 'padding-top': appOption.statusBarHeight + 90 + 'px' }">
            <view>页面参数{{ pageParam }}</view>
        </view>
        <view :class="['button_dark footer flex fvertical fcenter', appOption.isIPhoneX ? 'iphonex_bottom' : '' ]">
            <view>footer</view>
        </view>
    </view>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import store from "../store";
import apiUser from "../api";

@Component({})
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
    getData() {
        apiUser.searchUserType("vip").then(res => {
            console.log(res);
            
        })
    }
}
</script>

<style lang="scss">
.details{
    .goback_btn{ width: 300rpx; position: fixed; left: 20rpx; }
    .box{ width: 100%; height: 300vh; }
    .footer { width: 100%; position: fixed; bottom: 0; left: 0; }
}

</style>