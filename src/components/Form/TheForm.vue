<template>
  <view class="the-form">
    <slot></slot>
  </view>
</template>
<script lang="ts">
import { defineComponent } from "vue";
/** 一直累加的`formId`，需要时可以暴露给外部使用 */
let formId = 1;
export default defineComponent({
  name: "TheForm"
})
</script>
<script lang="ts" setup>
import TheFormItem from "./TheFormItem.vue";
import { PropType, provide, watch, onUnmounted } from "vue";
import { TheFormRules, TheFormValidateCallback } from "@/types";
import { useFormProps } from "./hooks";
import { getDeepLevelValue } from "@/utils";

/** `<TheFormItem>`实例类型 */
type ItemInstance = InstanceType<typeof TheFormItem>;

const props = defineProps({
  /** 表单数据对象 */
  model: {
    type: Object,
    required: true
  },
  /** 表单校验规则 */
  rules: {
    type: Object as PropType<TheFormRules>,
    default: () => ({})
  },
  /** 是否需要验证时滚动到对应位置 */
  validateScroll: {
    type: Boolean,
    default: true
  },
  ...useFormProps()
});

const currentId = formId;

formId++;

/** `model`原始数据，重置时用到 */
let beforeModel: BaseObj = {};

/** `rules`原始数据，重置时用 */
let beforeRules: TheFormRules = {};

/** `<TheFormItem>`实例列表 */
const items: Array<ItemInstance> = [];

/**
 * 设置原始数据
 * @param formData 设置的表单数据
 * @param formRules 设置的表单规则
 */
function setBeforeData(formData: BaseObj, formRules: TheFormRules) {
  // 先初始化对象
  beforeModel = {};
  beforeRules = {};

  if (formData) {
    // 这里可以直接暴力深拷贝，因为表单字段类型只能是常用那几个
    beforeModel = JSON.parse(JSON.stringify(formData));
  }

  if (formRules) {
    beforeRules = JSON.parse(JSON.stringify(formRules));
  }
}

setBeforeData(props.model, props.rules || {});

/** 传给子组件的事件表 */
const eventMap = {
  add: `add-the-form-item-${currentId}`,
  remove: `remove-the-form-item-${currentId}`
}

// 监听`<TheFormItem>`创建传进来的自身组件
uni.$on(eventMap.add, function (item: ItemInstance) {
  // console.log("addField >>", item, currentId);
  items.push(item);
})

// 监听对应的`<TheFormItem>`移除操作
uni.$on(eventMap.remove, function (item: ItemInstance) {
  // console.log("removeField >>", item);
  item.prop && items.splice(items.indexOf(item), 1);
})

// 组件卸载后移除监听事件
onUnmounted(function () {
  uni.$off([eventMap.add, eventMap.remove]);
})

provide("theFormComponent", {
  eventMap,
  // TODO: 这里使用 $props 作为注入的 key 原因是因为不想写接口声明，
  // InstanceType<typeof TheForm> 默认就可以动态识别 $props 中的动态类型
  // 节省了定义类型的代码操作，TheFormItem 那边传过来没有用 $props 作为 key
  // 是因为用到的数据都是一次性只读，非响应式，所以不需要用 $props 作为 key
  $props: props
})

/** 执行验证之后，储存的对象 */
let validateInfo: BaseObj<boolean> = {};

watch(() => props.model, function (res: BaseObj<string | number>) {
  const keys = Object.keys(validateInfo);
  if (keys.length) {
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = getDeepLevelValue(res, key);
      if (value !== "" && value !== null && value !== undefined && value.length !== 0) {
        validateField(key, isValid => {
          if (isValid) {
            delete validateInfo[key];
          }
        }, true);
      }
    }
  }
}, { deep: true });

/** 
 * 指定验证某个值
 * @param prop 要验证的字段
 * @param callback 验证回调
 * @param isWatch 是否内部 `watch` 方法调用
 */
function validateField(prop: string, callback?: TheFormValidateCallback, isWatch = false) {
  if (!props.model) return console.warn(`表单验证缺少 "model" 对象`);
  if (!props.rules) return console.warn(`表单验证缺少 "rules" 对象，无法验证`);
  let rules: TheFormRules = {};
  let failItems: Array<ItemInstance> = [];
  let adopt = true;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (((props.rules && props.rules[prop]) || (item.rules && item.rules.length)) && item.prop === prop) {
      item.validateField(function (prop, rule) {
        if (prop && rule.length > 0) {
          rules[prop] = rule;
          adopt = false;
          failItems.push(item);
          validateInfo[prop] = true;
        }
      });
      break;
    }
  }
  if (props.validateScroll && !isWatch && failItems.length > 0) {
    failItems[0].scrollIntoView();
  }
  callback && callback(adopt, rules);
}

/**
 * 表单验证
 * @public 暴露给外部调用的
 * @param callback 验证回调操作
 */
function validate(callback?: TheFormValidateCallback) {
  if (!props.model) return console.warn(`表单验证缺少 "model" 对象`);
  if (!props.rules) return console.warn(`表单验证缺少 "rules" 对象，无法验证`);
  let rules: TheFormRules = {};
  let failItems: Array<ItemInstance> = [];
  let adopt = true;
  items.forEach(function (item) {
    item.validateField(function (prop, rule) {
      if (prop && rule.length > 0) {
        rules[prop] = rule;
        adopt = false;
        failItems.push(item);
        validateInfo[prop] = true;
      }
    })
  });
  if (props.validateScroll && failItems.length > 0) {
    failItems[0].scrollIntoView();
  }
  callback && callback(adopt, rules);
}

/**
 * 移除所有校验
 * @description 暴露给外部调用的
 * @param callback 校验回调（同步），携带了原始数据：表单 和 规则
 */
function resetFields(callback?: (formData: any, rules: TheFormRules) => void) {
  if (!props.model) return console.warn(`表单验证缺少 "model" 对象`);
  // 清空验证对象，减少`watch`的性能开销
  validateInfo = {};

  // 方式一：
  // 直接修改对象的引用值，这种方式在微信小程序里面会失效，原因是微信把所有数据都 JSON 格式化了，导致某些引用终端，而且传参类型也只能是 string | number | object
  // modifyData(this.model, this.beforeModel);

  items.forEach(item => {
    item.resetField();
  })

  // 方式二：单向事件触发父组件更新数据，性能最优
  callback && callback(JSON.parse(JSON.stringify(beforeModel)), JSON.parse(JSON.stringify(beforeRules)));
}

/**
 * 移除某个验证
 * @param prop 指定值
 */
function resetField(prop: string) {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.prop === prop) {
      if (Object.prototype.hasOwnProperty.call(validateInfo, prop)) {
        delete validateInfo[prop];
      }
      item.resetField();
      break;
    }
  }
}

defineExpose({
  eventMap,
  validate,
  validateField,
  resetFields,
  resetField
});

</script>
<style lang="scss">
.the-form {
  width: 100%;
}
</style>