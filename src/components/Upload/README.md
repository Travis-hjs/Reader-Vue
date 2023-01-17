# 上传组件

## 上传图片组件

使用示例

```html
<template>
  <view>
    <!-- 多个组件时，可以加 uploadId 来区分 -->
    <UploadImage :src="formData.avatar" @change="onUpload" />
  </view>
</template>
<script lang="ts" setup>
import { reactive } from "vue";
import UploadImage from "@/components/Upload/Image.vue";
import { UploadChange } from "@/types";

const formData = reactive({
  avatar: ""
})

function onUpload(res: UploadChange) {
  formData.avatar = res.src;
}
</script>
```
