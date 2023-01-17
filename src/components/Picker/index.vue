<template>
  <view :class="['the-picker fwrap', { 'the-picker-show': show }]">
    <view class="f1" @click="clickCancel()"></view>
    <view class="picker-content">
      <!-- 操作栏 -->
      <view class="picker-option fvertical">
        <view class="btn" @click="clickCancel()">取消</view>
        <view class="f1 picker-title">{{ title }}</view>
        <view class="btn confirm" @click="clickConfirm()">确定</view>
      </view>
      <!-- 选择栏 -->
      <picker-view class="picker-view" indicator-style="height: 36px;" :value="selectIndexs" @change="pickerChange">
        <picker-view-column v-show="list.length > 0">
          <view class="picker-item ellipsis_1" v-for="(item, index) in list" :key="index">{{ item.label }}</view>
        </picker-view-column>
        <picker-view-column v-show="secondList.length > 0">
          <view class="picker-item ellipsis_1" v-for="(item, index) in secondList" :key="index">{{ item.label }}</view>
        </picker-view-column>
        <picker-view-column v-show="thirdList.length > 0">
          <view class="picker-item ellipsis_1" v-for="(item, index) in thirdList" :key="index">{{ item.label }}</view>
        </picker-view-column>
      </picker-view>
    </view>
  </view>
</template>
<script lang="ts">
import { defineComponent } from "vue";
/**
 * 底部弹出选择组件
 */
export default defineComponent({
  name: "ThePicker"
})
</script>
<script lang="ts" setup>
import { PropType, ref, watch, nextTick } from "vue";
import { PickerSelectItem } from "@/types";
import { checkType } from "@/utils";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  /** `change`事件携带的`id` */
  pickerId: {
    type: [Number, String],
    default: "",
  },
  /** 选择列表 */
  list: {
    type: Array as PropType<Array<PickerSelectItem>>,
    default: () => [],
  },
  title: {
    type: [String, Number],
    default: "",
  },
  /** 列数，0-3 */
  column: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits<{
  (event: "cancel"): void
  (event: "confirm", res: { id: any, value: Array<PickerSelectItem<any>> }): void
}>();

/** 选中的索引列表 */
const selectIndexs = ref([0, 0, 0]);
/** 第二级列表 */
const secondList = ref<Array<PickerSelectItem>>([]);
/** 第三级列表 */
const thirdList = ref<Array<PickerSelectItem>>([]);

function update() {
  const list = props.list;
  const indexs = selectIndexs.value;
  const column = props.column;

  const hasSecond = list.length && list[indexs[0]] && list[indexs[0]].children && list[indexs[0]].children!.length > 0;

  if (column >= 2) {
    secondList.value = hasSecond ? list[indexs[0]].children! : [{ label: "-", value: "" }];
  } else if (column === 0) {
    secondList.value = hasSecond ? list[indexs[0]].children! : [];
  }

  const second = secondList.value;
  const hasThird = second.length > 0 && second[indexs[1]] && second[indexs[1]].children && second[indexs[1]].children!.length > 0;

  if (column >= 3) {
    thirdList.value = hasThird ? second[indexs[1]].children! : [{ label: "-", value: "" }];
  } else if (column === 0) {
    thirdList.value = hasThird ? second[indexs[1]].children! : [];
  }
}

function clickCancel() {
  emit("cancel");
}

function pickerChange(e: UniAppChangeEvent<Array<number>>) {
  // console.log(e.detail.value);
  const list = e.detail.value;
  const val1 = checkType(list[0]) === "number" ? list[0] : 0;
  const val2 = checkType(list[1]) === "number" ? list[1] : 0;
  const val3 = checkType(list[2]) === "number" ? list[2] : 0;
  selectIndexs.value = [val1, val2, val3];
  update();
}

function clickConfirm() {
  const indexs = selectIndexs.value;
  const result = [props.list[indexs[0]]];

  if (secondList.value[indexs[1]]) {
    result.push(secondList.value[indexs[1]]);
  }
  if (thirdList.value[indexs[2]]) {
    result.push(thirdList.value[indexs[2]]);
  }

  emit("confirm", {
    id: props.pickerId,
    value: result.filter(item => item.value !== ""),
  });
}

watch(() => props.list, function () {
  nextTick(function () {
    update();
  })
}, {
  immediate: true
});

defineExpose({
  /**
   * 设置当前选择器选中的位置，即索引
   * @param indexs 
   */
  setIndexs(indexs: Array<number>) {
    const current = selectIndexs.value;
    selectIndexs.value = Object.assign(current, indexs);
  }
});

</script>
<style lang="scss">
@import "./picker.scss";
</style>
