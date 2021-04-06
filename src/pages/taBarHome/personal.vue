<template>
    <view class="personal">
        <button class="button_pink" @click="openDetail()">跳转详情页并传参</button>
        <div class="line"></div>
        <button class="button_dark" @click="openList()">跳转列表页</button>
        <div class="line"></div>
        <view>userInfo.token: {{ userInfo.token }}</view>
        <div class="line"></div>
        <button class="button" @click="clearToken()">修改`userInfo.token = ""`</button>
        <div class="line"></div>
        <button class="button" @click="setToken()">修改`userInfo.token = "123"`</button>
        <div class="line"></div>
        <UploadImage :uploadId="uploadInfo.index" :src="uploadInfo.path" @change="setContentImage" />
        <div class="line"></div>
        <TheButton :loading="loading" @click="setLoading(2)">加载 2 秒</TheButton>
        <div class="line"></div>
        <TheButton :round="true" :height="120" color="linear-gradient(45deg, #FA8BFF 0%, #2BD2FF 52%, #2BFF88 90%)" style="width: 70%" :loading="loading" @click="setLoading(3)">圆角按钮 加载 3 秒</TheButton>
        <div class="line"></div>
        <TheButton color="#020202" textColor="#f04e7d" :loading="loading" @click="setLoading(4)">自定义字体颜色 加载 4 秒</TheButton>
        <div class="line"></div>
        <view class="test_include">测试全局 `@include`</view>
    </view>    
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import UploadImage from "../../components/UploadImage.vue";
import TheButton from "../../components/TheButton.vue";
import utils from "../../utils";
import store from '../../store';
import { UploadImageRes } from "../../utils/interfaces";

@Component({
    components: {
        UploadImage,
        TheButton
    }
})
export default class Personal extends Vue {
    
    readonly userInfo = store.userInfo;

    uploadInfo = {
        index: 13,
        path: "",
    }

    openDetail() {
        uni.navigateTo({
            url: "/pages/details?id=" + utils.ranInt(12, 30)
        })
    }

    openList() {
        uni.navigateTo({
            url: "/pages/list"
        })
    }

    setToken() {
        store.updateUserInfo({ token: "123" });
    }

    clearToken() {
        store.updateUserInfo({ token: "" });
    }

    setContentImage(res: UploadImageRes) {
        this.uploadInfo.path = res.src;
    }

    loading = false;

    setLoading(val: number) {
        // console.log("执行");
        this.loading = true;
        setTimeout(() => this.loading = false, val * 1000);
    }
}

</script>

<style lang="scss">
.personal{ 
    padding: 30rpx 30rpx 40rpx; 
    .test_include{ 
        @include button();
        margin-bottom: 16px;
    }
    .line { width: 100%; padding-top: 40rpx; margin-bottom: 40rpx; border-bottom: solid 1px #eee; }
}
</style>