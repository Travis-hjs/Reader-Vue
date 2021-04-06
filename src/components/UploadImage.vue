<template>
    <view class="upload_image card">
        <image mode="widthFix" :src="src" v-if="src" />
        <view class="close" v-if="src" @click="removeImage"></view>
        <view class="upload_icon" @click="uploadImage" v-if="!src && !loading" :style="{ 'min-height': minHeight }"></view>
        <view class="flex fvertical fcenter" v-if="!src && loading" :style="{ 'min-height': minHeight }">
            <view class="preloader">
                <view class="preloader-inner">
                    <view class="preloader-inner-gap"></view>
                    <view class="preloader-inner-left">
                        <view class="preloader-inner-half-circle"></view>
                    </view>
                    <view class="preloader-inner-right">
                        <view class="preloader-inner-half-circle"></view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import utils from "../utils";

@Component({})
export default class UploadImage extends Vue {
    @Prop({
        type: String,
        default: "280rpx"
    })
    minHeight!: string;

    @Prop({
        type: String,
        default: ""
    })
    src!: string;

    /** this.$emit 携带的id */
    @Prop({
        type: [String, Number],
        default: ""
    })
    uploadId!: string;

    /** 是否上传中 */
    loading = false

    /** 上传图片 */
    uploadImage() {
        if (this.loading) return;
        const THAT = this;
        uni.chooseImage({
            count: 1,
            sizeType: "compressed",
            sourceType: ["album"],
            success(res) {
                // console.log(res);
                const result = res.tempFilePaths as Array<string>;
                // 模拟上传
                THAT.loading = true;
                setTimeout(() => {
                    THAT.loading = false;
                    THAT.$emit("change", {
                        id: THAT.uploadId,
                        src: result[0]
                    });
                }, 800);

                // THAT.loading = true;
                // uni.uploadFile({
                //     url: "https://unidemo.dcloud.net.cn/upload",
                //     filePath: THAT.pageData.avatarUrl,
                //     fileType: "image",
                //     name: "data",
                //     success(uploadResult) {
                //         THAT.loading = false;
                //         console.log("上传组件上传成功 >>", uploadResult.data);
                //         THAT.$emit("change", {
                //             id: THAT.uploadId,
                //             src: uploadResult.data
                //         });
                //     },
                //     fail(uploadFail) {
                //         THAT.loading = false;
                //         console.log("上传组件上传失败 ！！！", uploadFail);
                //         utils.showToast(`上传失败 >> ${uploadFail.errMsg}`);
                //     }
                // });
            },
            fail(err) {
                console.log("chooseImage fail >>", err);
                utils.showToast("读取图片失败！");
            }
        })
    }

    /** 清除图片 */
    removeImage() {
        this.$emit("change", {
            id: this.uploadId,
            src: ""
        });
    }
}
</script>
<style lang="scss">
.upload_image{ 
    width: 100%; position: relative; 
    .close {
        width: 70rpx; height: 70rpx; background-color: rgba(0,0,0,0.45); border-radius: 50%; position: absolute; top: 16rpx; right: 16rpx; 
        &::before{ content: ""; width: 64%; height: 2px; background-color: #eee; border-radius: 1px; position: absolute; top: 50%; left: 18%; transform: translateY(-50%) rotate(45deg); }
        &::after{ content: ""; width: 64%; height: 2px; background-color: #eee; border-radius: 1px; position: absolute; top: 50%; left: 18%; transform: translateY(-50%) rotate(-45deg); }
    }
    .upload_icon {
        width: 100%; height: 100%; position: relative; 
        &::before{ content: ""; width: 100rpx; height: 2px; background-color: #999; border-radius: 1px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);}
        &::after{ content: ""; width: 100rpx; height: 2px; background-color: #999; border-radius: 1px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-90deg); }
    }
}
</style>