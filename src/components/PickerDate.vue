<template>
    <view class="picker_date flex" v-show="show">
        <view class="f1" @click="clickCancel()"></view>
        <view class="picker_content">
            <!-- 操作栏 -->
            <view class="picker_option flex fvertical">
                <view class="btn" @click="clickCancel()">取消</view>
                <view class="f1"></view>
                <view class="btn confirm" @click="clickConfirm()">确定</view>
            </view>

            <picker-view class="picker_view" indicator-style="height: 36px;" @change="pickerChange">
                <picker-view-column v-if="type === 'Y-M-D' || type === 'Y-M' || type === 'Y'">
                    <view class="picker_item ellipsis_1" v-for="(item, index) in yearList" :key="index">{{item}}</view>
                </picker-view-column>
                <picker-view-column v-if="type === 'Y-M-D' || type === 'Y-M'">
                    <view class="picker_item ellipsis_1" v-for="(item, index) in monthList" :key="index">{{item}}</view>
                </picker-view-column>
                <picker-view-column v-if="type === 'Y-M-D'">
                    <view class="picker_item ellipsis_1" v-for="(item, index) in dayList" :key="index">{{item}}</view>
                </picker-view-column>
            </picker-view>
        </view>
    </view>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

/** 当前时间 */
const now = new Date();
// /** 一天的毫秒数 */
// const oneDayMillisecond = 86400000

interface DateChangeType {
    detail: {
        /** 选择器索引列表 */
        value: Array<number>
    }
}

/**
 * 日期选择组件
 */
@Component({})
export default class PickerDate extends Vue {
    @Prop({
        type: Boolean,
        default: false
    })
    show!: boolean

    /** 选择类型 */
    @Prop({
        type: String,
        default: "Y-M-D"
    })
    type!: "Y-M-D" | "Y-M" | "Y"

    /** 开始年份 */
    @Prop({
        type: Number,
        default: now.getFullYear() - 10
    })
    startYear!: number

    /** 结束年份 */
    @Prop({
        type: Number,
        default: now.getFullYear()
    })
    endYear!: number

    /** 月份列表 */
    readonly monthList = new Array(12).fill(0).map((_, index) => ("0" + (index + 1)).slice(-2));
    /** 年份列表 */
    get yearList() {
        const list = [];
        for (let i = this.startYear; i <= this.endYear; i++) {
            list.push(i);
        }
        return list;
    }
    /** 天数列表 */
    dayList: Array<string> = [];

    /** 获取天数列表（这里计算属性不会监听变动，所以需要手动设置） */
    getDayList() {
        const list: Array<string> = [];
        const year = this.selectYear || this.startYear;
        const month = this.selectMonth || this.monthList[0];
        const dayTotal = new Date(year, Number(month), 0).getDate();
        // console.log("dayTotal >>", dayTotal);
        for (let i = 1; i <= dayTotal; i++) {
            list.push(("0" + i).slice(-2));
        }
        return list;
    }

    /** 选中的年份 */
    selectYear!: number;
    /** 选中的月份 */
    selectMonth!: string;
    /** 选中的天数 */
    selectDay!: string;

    // /** 选择器显示 */
    // pickerContentShow = false;

    // @Watch("show")
    // onShowChange(value: boolean) {
    //     if (value) {
    //         this.$nextTick(() => {
    //             this.pickerContentShow = true;
    //         })
    //     } else {
    //         this.pickerContentShow = false;
    //     }
    // }

    created() {
        // 创建的时候要首次设置一下
        this.dayList = this.getDayList();
    }
    
    pickerChange(e: DateChangeType) {
        const list = e.detail.value;
        this.selectYear = this.yearList[list[0]];
        if (list.length > 1) {
            this.selectMonth = this.monthList[list[1]];
        }
        // 这里要手动更新一下天数列表
        this.dayList = this.getDayList();
        if (list.length > 2) {
            this.selectDay = this.dayList[list[2]];
        }
    }

    clickCancel() {
        this.$emit("cancel");
    }

    clickConfirm() {
        let result = (this.selectYear || this.startYear).toString();
        if (this.type === "Y-M-D" || this.type === "Y-M") {
            result = `${result}-${this.selectMonth || this.monthList[0]}`
        }
        if (this.type === "Y-M-D") {
            result = `${result}-${this.selectDay || this.dayList[0]}`;
        }
        this.$emit("confirm", result);
    }
}
</script>
<style lang="scss">
.picker_date {
    width: 100%; height: 100%; position: fixed; top: 0; left: 0; background-color: rgba(0,0,0,.45); z-index: 999; overflow: hidden; flex-direction: column; -webkit-flex-direction: column; animation: fadeShow 0.3s ease;
    .picker_option { 
        width: 100%; padding: 12rpx 0;
        .btn { font-size: 30rpx; width: 160rpx; line-height: 80rpx; color: #999; text-align: center; }
        .confirm { color: #F37131; }
    }
    .picker_content { 
        background-color: #ffffff; animation: pickerShowSlide 0.24s ease; 
        .picker_view { 
            width: 100%; height: 236px; 
            .picker_item { text-align: center; line-height: 36px; }
        }
    }
}
@keyframes fadeShow {
    0% { opacity: 0; }
    100% { opacity: 1; }
}
@keyframes pickerShowSlide {
    0%{ transform: translate3d(0, 100%, 0); }
    100%{ transform: translate3d(0, 0%, 0); }
}
</style>