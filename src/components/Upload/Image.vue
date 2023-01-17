<template>
  <view class="upload-image card">
    <!-- H5 中 widthFix 不生效，要用下面的方式 -->
    <!-- #ifdef H5 -->
    <img style="width: 100%; display: block" :src="src" v-if="src">
    <!-- #endif -->

    <!-- #ifndef H5 -->
    <image mode="widthFix" :src="src" v-if="src" />
    <!-- #endif -->

    <view class="close" v-if="src" @click="removeImage()"></view>
    <view class="upload-icon" @click="uploadImage()" v-if="!src && !loading" :style="{ 'min-height': minHeight }"></view>
    <view class="fvc" v-if="!src && loading" :style="{ 'min-height': minHeight }">
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
export default defineComponent({
  name: "UploadImage"
})
</script>
<script lang="ts" setup>
import { defineComponent, ref } from "vue";
import { showToast } from "@/utils/control";
import { UploadChange } from "@/types";

const props = defineProps({
  minHeight: {
    type: String,
    default: "280rpx",
  },
  src: {
    type: String,
    default: "",
  },
  /** emit 时携带的 id */
  uploadId: {
    type: [String, Number],
    default: "",
  },
})

const emit = defineEmits<{
  (event: "change", res: UploadChange): void
}>();

const loading = ref(false);

function uploadImage() {
  if (loading.value) return;
  uni.chooseImage({
    count: 1,
    sizeType: "compressed",
    sourceType: ["album"],
    success(res) {
      // console.log(res);
      const result = res.tempFilePaths as Array<string>;
      // 模拟上传
      loading.value = true;
      setTimeout(() => {
        loading.value = false;
        emit("change", {
          id: props.uploadId,
          src: result[0],
        });
      }, 800);

      // loading.value = true;
      // uni.uploadFile({
      //   url: "https://unidemo.dcloud.net.cn/upload",
      //   filePath: result[0],
      //   fileType: "image",
      //   name: "data",
      //   success(uploadResult) {
      //     loading.value = false;
      //     console.log("上传组件上传成功 >>", uploadResult.data);
      //     emit("change", {
      //       id: props.uploadId,
      //       src: uploadResult.data
      //     });
      //   },
      //   fail(uploadFail) {
      //     loading.value = false;
      //     console.log("上传组件上传失败 ！！！", uploadFail);
      //     showToast(`上传失败 >> ${uploadFail.errMsg}`);
      //   }
      // });
    },
    fail(err) {
      console.log("chooseImage fail >>", err);
      showToast("读取图片失败！");
    },
  });
}

/** 清除图片 */
function removeImage() {
  emit("change", {
    id: props.uploadId,
    src: "",
  });
}

</script>
<style lang="scss">
.upload-image {
  width: 100%;
  position: relative;
  .close {
    width: 70rpx;
    height: 70rpx;
    background-color: rgba(0, 0, 0, 0.45);
    border-radius: 50%;
    position: absolute;
    top: 16rpx;
    right: 16rpx;
    &::before {
      content: "";
      width: 64%;
      height: 2px;
      background-color: #eee;
      border-radius: 1px;
      position: absolute;
      top: 50%;
      left: 18%;
      transform: translateY(-50%) rotate(45deg);
    }
    &::after {
      content: "";
      width: 64%;
      height: 2px;
      background-color: #eee;
      border-radius: 1px;
      position: absolute;
      top: 50%;
      left: 18%;
      transform: translateY(-50%) rotate(-45deg);
    }
  }
  .upload-icon {
    width: 100%;
    height: 100%;
    position: relative;
    &::before {
      content: "";
      width: 100rpx;
      height: 2px;
      background-color: #999;
      border-radius: 1px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    &::after {
      content: "";
      width: 100rpx;
      height: 2px;
      background-color: #999;
      border-radius: 1px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-90deg);
    }
  }
}
</style>