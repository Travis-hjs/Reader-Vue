<template>
    <view :class="['book', showMenu ? '' : 'hide_menu', themes[AppOption.theme].className]">
        <!-- 顶部菜单 -->
        <view class="top">
            <view class="back" @click="goBack">
                <uni-icons type="arrowleft" size="22" :color="themes[AppOption.theme].text" />
            </view>
            <view class="option">
                <view class="option_btn">下载</view>
                <view class="option_btn">加入书架</view>
                <view class="option_btn">
                    <uni-icons type="more-filled" size="18" :color="themes[AppOption.theme].text" />
                </view>
            </view>
        </view>

        <!-- 阅读内容页 -->
        <view class="content" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">

            <view class="page" v-for="(style, index) in styles" :key="index" :style="{ transition: style.transition, transform: 'translate3d('+ style.transform +',0px,0px)', zIndex: style.zIndex }">
                <view class="status_bar"></view>
                <view class="info">
                    <view class="name">小说名</view>
                    <view class="integral">
                        <text class="text">300币</text>
                        <view class="icon">$</view>
                    </view>
                </view>

                <!-- <view style="text-align: end;">pageIndex: {{ pageIndex }} z-index: {{ styles[index].zIndex }}</view> -->
                
                <!-- 小说标题 -->
                <view :style="{ 
                    fontSize: AppOption.sizeInfo.title + 'px', 
                    lineHeight: AppOption.sizeInfo.tineHeight + 'px', 
                    marginBottom: AppOption.sizeInfo.margin +'px', 
                }" v-show="pageTextList[index].title">{{ pageTextList[index].title }}</view>

                <!-- 小说段落 -->
                <view :style="{ 
                    fontSize: AppOption.sizeInfo.p + 'px', 
                    lineHeight: AppOption.sizeInfo.pLineHeight + 'px', 
                    marginBottom: AppOption.sizeInfo.margin +'px',
                    textIndent: '24px'
                }" v-for="(p, pIndex) in pageTextList[index].content" :key="pIndex">{{ p }}</view>

            </view>

        </view>

        <!-- 底部菜单 -->
        <view class="bottom">
            <view class="switch">
                <view class="switch_icon" @click="chapterPrev">
                    <uni-icons type="arrowleft" size="22" :color="themes[AppOption.theme].text" />
                </view>
                <view style="flex: 1">
                    <slider :value="chapterIndex" @change="sliderChapter" :max="chapterMax" :block-color="themes[AppOption.theme].text" block-size="20" :activeColor="themes[AppOption.theme].text" :backgroundColor="themes[AppOption.theme].slide" />
                </view>
                <view class="switch_icon" @click="chapterNext">
                    <uni-icons type="arrowright" size="22" :color="themes[AppOption.theme].text" />
                </view>
            </view>
            <view class="menu">
                <view class="menu_tip">章节位置</view>
                <view class="book_pos">第{{ chapterIndex + 1 }}章 《甄嬛传奇》</view>
            </view>
            <view class="menu">
                <view class="menu_tip">字体设置</view>
                <view class="size_setting">
                    <view class="size_btn" @click="reduceFontSize">
                        <text>A-</text>
                    </view>
                    <view class="size_btn" @click="addFontSize">
                        <text>A+</text>
                    </view>
                </view>
            </view>
            <view class="menu">
                <view class="menu_tip">背景主题</view>
                <view :class="['theme', AppOption.theme == index ? 'theme_on' : '', item.className]" v-for="(item, index) in themes" :key="index" @click="switchTheme(index)"></view>
            </view>
        </view>

        <!-- 新手提示 -->
        <book-tip v-if="firstTip" @click="closeBookTip" />
    </view>    
</template>

<script>
import Icon from '../components/Icons';
import Global from '../modules/Global';
import BookTip from '../components/BookTip';
import utils from '../modules/utils';
import {
    createBookContent
} from '../modules/createdata';

/** 页面过渡时间（毫秒） */
const slideTime = 260;
/** 有效拖拽时间 */
const dragTime = 300;

export default {
    components: {
        'uni-icons': Icon,
        'book-tip': BookTip
    },
    data() {
        return {
            /** `APP`操作信息 */
            AppOption: Global.AppOption,
            /** 显示菜单 */
            showMenu: false,
            /** 页面宽度 */
            pageWidth: 0,
            /** 页面高度 */
            pageHeight: 0,
            /** 状态栏高度 */
            statusBarHeight: 0,
            /** 
             * 页面切换索引 `[0,1,2]` 因为初始是中间的显示内容，所以初始值为`1`
            */
            pageIndex: 1,
            /** 页面负偏移量（负数） */
            pageSlideValue: 0,
            /** 触摸位置 */
            touchPosition: 0,
            /** 触摸的时间 */
            touchTime: 0,
            /** 首次打开提示 */
            firstTip: false,

            styles: [
                {
                    transform: '-102%',
                    transition: '0s all',
                    zIndex: '3'
                }, {
                    transform: '0px',
                    transition: '0s all',
                    zIndex: '2'
                }, {
                    transform: '0px',
                    transition: '0s all',
                    zIndex: '1'
                }
            ],
            themes: [
                {
                    className: 'theme1',
                    text: '#383838',
                    slide: '#eeeeee'
                }, {
                    className: 'theme2',
                    text: '#362302',
                    slide: '#d7d2bf'
                }, {
                    className: 'theme3',
                    text: '#252a24',
                    slide: '#d0dac2'
                }, {
                    className: 'theme4',
                    text: '#353a3d',
                    slide: '#c4d1da'
                }, {
                    className: 'theme5',
                    text: '#6f6f6f',
                    slide: '#252525'
                },
            ],
            /** 最大章节数 */
            chapterMax: 10,
            /** 章节位置（0开始） */
            chapterIndex: 0,
            /** 章节的页数位置 */
            chapterPage: 0,
            /** 
             * 章节阅读器数据 
             * @type {Array<Array<{title: string, content: Array<string>}>>}
            */
            chapterList: [],
            /** 
             * 请求回来的章节阅读器数据 | 下载的`json`也是这个 
             * @type {Array<{title: string, content: string}>}
            */
            cacheData: [],
            /** 页面内容列表 */
            pageTextList: [
                {
                    title: '', // 'page-1',
                    content: []
                }, {
                    title: '', // 'page-2',
                    content: []
                }, {
                    title: '', // 'page-3',
                    content: []
                }
            ],
        }
    },
    onLoad(query) {
        if (this.AppOption.first) {
            setTimeout(() => {
                this.firstTip = true;
            }, 800);
        }
        this.initPageInfo();
    },
    methods: {
        /** 关闭新手提示 */
        closeBookTip() {
            this.AppOption.first = this.firstTip = false;
            Global.saveAppOption();
        },
        /** 返回上层页面 */
        goBack() {
            uni.navigateBack();
        },
        /**
         * 切换主题
         * @param {number} index
         */
        switchTheme(index) {
            this.AppOption.theme = index;
            Global.saveAppOption();
        },
        /** 初始化获取页面信息 */
        initPageInfo() {
            this.pageWidth = uni.getSystemInfoSync().windowWidth;
            this.pageHeight = uni.getSystemInfoSync().windowHeight;
            this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
            this.pageSlideValue = -(this.pageWidth + 5);
            this.styles[0].transform = `${this.pageSlideValue}px`;
            // 获取数据
            this.getChapterData(this.chapterIndex, res => {
                this.updateChapterList(this.chapterIndex, res);
                this.updateContent();
            });
        },
        /** 切换到上一页 */
        pagePrev() {
            this.pageIndex --;
            if (this.pageIndex < 0) this.pageIndex = 2;

            let lastIndex = this.pageIndex - 1;
            if (lastIndex < 0) lastIndex = 2;
            this.styles[lastIndex].transition = '0s all';
            this.styles[lastIndex].transform = `${this.pageSlideValue}px`;
            this.styles[lastIndex].zIndex = '3';

            let nextIndex = lastIndex - 1;
            if (nextIndex < 0) nextIndex = 2;
            this.styles[nextIndex].transition = '0s all';
            this.styles[nextIndex].transform = '0px';
            this.styles[nextIndex].zIndex = '1';

            this.styles[this.pageIndex].transition = `${slideTime}ms all`;
            this.styles[this.pageIndex].transform = '0px';
            this.styles[this.pageIndex].zIndex = '2';
            
            if (this.chapterPage > 0) {
                this.chapterPage --;
                this.updateContent();
            } else {
                this.chapterIndex --;
                this.chapterPage = this.chapterList[this.chapterIndex].length - 1;
            }
        },
        /** 切换到下一页 */
        pageNext() {
            const currentIndex = this.pageIndex;
            this.styles[currentIndex].transition = `${slideTime}ms all`;
            this.styles[currentIndex].transform = `${this.pageSlideValue}px`;
            this.styles[currentIndex].zIndex = '3';

            let nextIndex = currentIndex + 1;
            if (nextIndex > 2) nextIndex = 0;
            this.styles[nextIndex].transition = `${slideTime}ms all`;
            this.styles[nextIndex].transform = '0px';
            this.styles[nextIndex].zIndex = '2';

            let lastIndex = nextIndex + 1;
            if (lastIndex > 2) lastIndex = 0;
            this.styles[lastIndex].transition = '0s all';
            this.styles[lastIndex].transform = '0px';
            this.styles[lastIndex].zIndex = '1';

            this.pageIndex ++;
            if (this.pageIndex > 2) this.pageIndex = 0;

            // console.log('执行', currentIndex);

            // setTimeout(() => {
            //     this.styles[this.pageIndex].zIndex = '3';
            //     this.styles[nextIndex].zIndex = '2';
            //     this.styles[lastIndex].zIndex = '1';
            // }, slideTime);


            if (this.chapterPage == this.chapterList[this.chapterIndex].length - 1) {
                this.chapterIndex++;
                this.chapterPage = 0;
            } else {
                this.chapterPage ++;
                this.updateContent();
            }
        },
        onTouchStart(e) {
            // console.log(e);
            const pageX = e.touches[0].pageX;
            this.touchPosition = pageX;
            this.touchTime = Date.now();
        },
        onTouchMove(e) {
            if (this.showMenu) return;
            const pageX = e.touches[0].pageX;
            const slide = pageX - this.touchPosition;
            let lastIndex = this.pageIndex - 1;
            if (lastIndex < 0) lastIndex = 2; 
            if (slide < 0) {
                this.styles[this.pageIndex].transition = '0s all';
                this.styles[this.pageIndex].transform = `${slide}px`;
            } else {
                this.styles[lastIndex].transition = '0s all';
                this.styles[lastIndex].transform = `${this.pageSlideValue + slide}px`;
            }
            // console.log('onTouchMove', slide);
        },
        onTouchEnd(e) {
            if (this.showMenu) return this.showMenu = false;
            const pageX = e.changedTouches[0].pageX;
            const now = Date.now();
            const slideX = pageX - this.touchPosition;
            const value = this.pageWidth / 3;
            /** 返回原来位置 */
            const backPosition = () => {
                let lastIndex = this.pageIndex - 1;
                if (lastIndex < 0) lastIndex = 2; 
                this.styles[lastIndex].transition = `${slideTime}ms all`;
                this.styles[lastIndex].transform = `${this.pageSlideValue}px`;
                this.styles[this.pageIndex].transition = `${slideTime}ms all`;
                this.styles[this.pageIndex].transform = '0px';
            }
            // console.log('onTouchEnd', slideX);
            if (Math.abs(slideX) <= 0) {
                if (pageX < value) {
                    // console.log('点击左边');
                    if (this.isFirstPage()) { 
                        utils.showToastBottom('没有上一页了');
                    }else {
                        this.pagePrev();
                    } 
                } else if (pageX > value * 2) {
                    // console.log('点击右边');
                    if (this.isLastPage()) {
                        utils.showToastBottom('当前小说已完结');
                    } else {
                        this.pageNext();
                    }
                } else {
                    // console.log('点击中间');
                    this.showMenu = true;
                }
            } else {
                // console.log(now - this.touchTime, slideX, value);
                if (now - this.touchTime < dragTime || (now - this.touchTime > dragTime && Math.abs(slideX) >= value)) {
                    if (slideX > 0) {
                        // console.log('向右边滑动');
                        if (this.isFirstPage()) {
                            utils.showToastBottom('没有上一页了');
                            backPosition();
                        } else {
                            this.pagePrev();
                        }
                    } else {
                        // console.log('向左边滑动');
                        if (this.isLastPage()) {
                            utils.showToastBottom('当前小说已完结');
                            backPosition();
                        } else {
                            this.pageNext();
                        }
                    }
                } else {
                    // console.log('执行');
                    // 重置当前页和上一页的回弹
                    backPosition();
                }
            }
        },

        // /** 点击切换（旧版） */
        // contentClick(e) {
        //     // console.log(e);
        //     const pageX = e.touches[0].pageX;
        //     if (this.showMenu) {
        //         this.showMenu = false;
        //     } else {
        //         const value = this.pageWidth / 3;
        //         if (pageX < value) {
        //             // console.log('点击左边');
        //             this.pagePrev();
        //         } else if (pageX > value * 2) {
        //             // console.log('点击右边');
        //             this.pageNext();
        //         } else {
        //             // console.log('点击中间');
        //             this.showMenu = true;
        //         }
        //     }
        // },

        /** 上一章 */
        chapterPrev() {
            this.chapterIndex --;
            this.getChapterData(this.chapterIndex, res => {
                this.chapterPage = 0; // 重置章节到第一页
                this.updateChapterList(this.chapterIndex, res);
                this.updateContent();
            });
        },
        /** 下一章 */
        chapterNext() {
            if (this.chapterIndex == this.chapterMax) return utils.showToastBottom('当前小说已完结');
            this.chapterIndex ++;
            this.getChapterData(this.chapterIndex, res => {
                this.chapterPage = 0; // 重置章节到第一页
                this.updateChapterList(this.chapterIndex, res);
                this.updateContent();
            });
        },
        /** 滑动切换章节 */
        sliderChapter(e) {
            this.chapterIndex = Number(e.detail.value);
            // console.log(this.chapterIndex);
            this.getChapterData(this.chapterIndex, res => {
                this.chapterPage = 0; // 重置章节到第一页
                this.updateChapterList(this.chapterIndex, res);
                this.updateContent();
            });
        },
        /** 加大字体 */
        addFontSize() {
            if (this.AppOption.sizeInfo.p >= 22) return utils.showToastBottom('已经是最大字体了');
            this.AppOption.sizeInfo.title ++;
            this.AppOption.sizeInfo.p ++;
            this.AppOption.sizeInfo.tLineHeight = this.AppOption.sizeInfo.title * 1.5;
            this.AppOption.sizeInfo.pLineHeight = this.AppOption.sizeInfo.p * 1.5;
            Global.saveAppOption();

            this.getChapterData(this.chapterIndex, res => {
                this.updateChapterList(this.chapterIndex, res);
                this.updateContent();
            });
        },
        /** 缩小字体 */
        reduceFontSize() {
            if (this.AppOption.sizeInfo.p <= 15) return utils.showToastBottom('已经是最小字体了');
            this.AppOption.sizeInfo.title --;
            this.AppOption.sizeInfo.p --;
            this.AppOption.sizeInfo.tLineHeight = this.AppOption.sizeInfo.title * 1.5;
            this.AppOption.sizeInfo.pLineHeight = this.AppOption.sizeInfo.p * 1.5;
            Global.saveAppOption();

            this.getChapterData(this.chapterIndex, res => {
                this.updateChapterList(this.chapterIndex, res);
                this.updateContent();
            });
        },
        /** 
         * 更新章节列表数据 
         * @param {number} chapter 第几章
         * @param {{title: string, content: string}} data 
        */
        updateChapterList(chapter, data) {
            /** 当前章节的段落列表 */
            const contents = data.content.split('<br />');
            /** 下边距 */
            const margin = this.AppOption.sizeInfo.margin;
            /** 内容实际宽度 */
            const width = this.pageWidth - 32;
            /** 计算的页数 */
            let page = 0;
            /** 是否第一页 */
            let firstPage = true;
            /** 一页的字体容器高度 */
            let height = 0;
            /** 一页的字体列表 */
            let list = [];
            /** 下一页超出的数据 */
            let nextPageText = {
                height: 0,
                text: ''
            };
            
            // 先重置为一个空的数组，因为二维数组的值初始化是`undefined`
            this.chapterList[chapter] = [];

            // console.log('页面高度', this.pageHeight);
            // console.log('页面实际宽度', width);

            for (let i = 0; i < contents.length; i++) {
                /** 单个字体的宽度 */
                const sizeWidth = 1;
                const item = contents[i];
                const fontWidth = item.length * (this.AppOption.sizeInfo.p * sizeWidth) + 24; // 24 是段落缩进像素
                const row = Math.ceil(fontWidth / width);
                const itemHeight = row * this.AppOption.sizeInfo.pLineHeight + margin;
                // console.log(`第${i + 1}段`, row + '行', fontWidth, item);
                // console.log(`第${i + 1}段`, row + '行');
                
                if (firstPage) {
                    height += this.AppOption.sizeInfo.tLineHeight + margin;
                    firstPage = false;
                } 
                
                // 把上一页超出的内容加到当前页中去
                if (nextPageText.height) {
                    height += nextPageText.height;
                    list.push(nextPageText.text);
                    // 用完拼接好的页面记得清除
                    nextPageText.height = 0; 
                    nextPageText.text = '';
                }

                list.push(item);
                height += itemHeight;
                
                /**
                 * 56是 .info + .page padding的上下距离 
                 */
                if (height - margin > this.pageHeight - 56 - this.statusBarHeight) {
                    list.pop();
                    nextPageText.height = itemHeight;
                    nextPageText.text = item;
                    // console.log('页数:', page, 'height:', height - itemHeight, '段数:', list.length);
                    // 下一页
                    this.chapterList[chapter][page] = {
                        title: '',
                        content: list
                    }
                    list = [];
                    height = 0;
                    page ++;
                } 
                
            }   
            this.chapterList[chapter][0].title = data.title;
            // console.log(`第${chapter}章`, this.chapterList[chapter]);
            // 这里不能直接调用，不然在计算下一章回调时会出现死循环
            // this.updateContent(); 
        },
        /** 更新3个页面的文章内容 */
        updateContent() {
            /** 当前章节内容列表 */
            const contents = this.chapterList[this.chapterIndex];

            // 调整字体由大到小的时候，章节列表会对应的缩短，所以要检测当前章节的页数位置
            if (this.chapterPage > contents.length - 1) {
                this.chapterPage = contents.length - 1;
            }

            // 上一页显示的内容
            let lastIndex = this.pageIndex - 1;
            if (lastIndex < 0) lastIndex = 2;
            if (this.isFirstPage()) {
                this.pageTextList[lastIndex].title = '';
                this.pageTextList[lastIndex].content = '';
            } else if (this.chapterPage == 0) {
                // 写到这里...判断加载上一章的篇章
                /** 上一章 */
                const prevChapter = this.chapterIndex - 1;
                // 加载上一章
                this.getChapterData(prevChapter, res => {
                    this.updateChapterList(prevChapter, res);
                    /** 最后一页 */
                    const lastPage = this.chapterList[prevChapter].length - 1;
                    this.pageTextList[lastIndex].title = this.chapterList[prevChapter][lastPage].title;
                    this.pageTextList[lastIndex].content = this.chapterList[prevChapter][lastPage].content;
                });
            } else {
                this.pageTextList[lastIndex].title = contents[this.chapterPage - 1].title;
                this.pageTextList[lastIndex].content = contents[this.chapterPage - 1].content;
            }

            // 当前显示的内容
            this.pageTextList[this.pageIndex].title = contents[this.chapterPage].title;
            this.pageTextList[this.pageIndex].content = contents[this.chapterPage].content;

            // 下一页显示的内容
            let nextIndex = this.pageIndex + 1;
            if (nextIndex > 2) nextIndex = 0;
            if (this.isLastPage()) {
                // 最后一章最后一页
                this.pageTextList[nextIndex].title = '';
                this.pageTextList[nextIndex].content = '';
            } else if (this.chapterPage == contents.length - 1) {
                // console.log('当前章数', this.chapterPage, '总列表', this.chapterList);
                /** 下一章索引 */
                const nextChapter = this.chapterIndex + 1;
                // 加载下一章
                this.getChapterData(nextChapter, res => {
                    this.updateChapterList(nextChapter, res);
                    this.pageTextList[nextIndex].title = this.chapterList[nextChapter][0].title;
                    this.pageTextList[nextIndex].content = this.chapterList[nextChapter][0].content;
                });
            } else {
                this.pageTextList[nextIndex].title = contents[this.chapterPage + 1].title;
                this.pageTextList[nextIndex].content = contents[this.chapterPage + 1].content;
            }

        },
        /** 是否为第一页 */
        isFirstPage() {
            return (this.chapterIndex == 0 && this.chapterPage == 0);
        },
        /** 是否最后一页 */
        isLastPage() {
            return (this.chapterIndex == this.chapterMax && this.chapterPage == this.chapterList[this.chapterIndex].length - 1);
        },
        /**
         * 获取章节内容，有就从缓存中获取，没有则从接口中获取
         * @param {number} chapter 第几章
         * @param {(res: {title: string, content: string}) => void} success 成功回调
         */
        getChapterData(chapter, success) {
            if (this.cacheData[chapter]) {
                success(this.cacheData[chapter])
            } else {
                uni.showLoading({
                    title: '加载中',
                    mask: true
                });
                setTimeout(() => {
                    uni.hideLoading();
                    const data = createBookContent(chapter);
                    this.cacheData[chapter] = data;
                    // this.cacheData.push(data);
                    success(data);
                }, 200);
            }
        }
    }
}
</script>

<style>
.status_bar { height: var(--status-bar-height); width: 100%; }
.book{ width: 100%; height: 100vh; overflow: hidden; box-sizing: border-box; }

/* 顶部菜单栏 */
.top{ width: 100%; height: 88rpx; padding-top: var(--status-bar-height); position: fixed; top: 0; left: 0; z-index: 5; display: flex; flex-wrap: wrap; align-items: center; overflow: hidden; transition: .3s all;}
.top .back{ padding: 14rpx; }
.top .option{ flex: 1; display: flex; flex-wrap: wrap; flex-direction: row; justify-content: flex-end;}
.top .option_btn{ font-size: 30rpx; margin-right: 10rpx; padding: 10rpx; }

/* 底部菜单栏 */
.bottom{ position: fixed; bottom: 0; left: 0; width: 100%; transition: .3s all; z-index: 6; padding: 30rpx 0; }
.bottom .switch{ width: 100%; display: flex; flex-wrap: wrap; align-items: center; margin-bottom: 20rpx; }
.bottom .switch_icon{ padding: 14rpx; }
.bottom .menu{ width: 100%; height: 100rpx; display: flex; flex-wrap: wrap; align-items: center; }
.bottom .menu .menu_tip{ font-size: 24rpx; padding: 0 40rpx; }
.bottom .menu .theme{ width: 66rpx; height: 66rpx; border-radius: 50%; margin-right: 50rpx; box-sizing: border-box; }
.bottom .menu .theme:nth-child(6) { margin-right: 0; }
.bottom .menu .book_pos{ font-size: 30rpx; }
.bottom .menu .size_setting{ flex: 1; display: flex; flex-wrap: wrap; align-items: center; }
.bottom .menu .size_btn{ flex: 1; text-align: center; line-height: 70rpx; font-size: 30rpx; margin-right: 30rpx; border-radius: 35rpx; background-color: rgba(0,0,0,0.1); }

/* 内容容器 */
.content{ width: 100%; height: 100%; position: relative; }
.content .page{ width: 100%; height: 100%; padding: 8px 16px; box-sizing: border-box; box-shadow: 0 5px 10px rgba(0,0,0,0.5); position: absolute; top: 0; left: 0; overflow: hidden; }
.content .info{ width: 100%; height: 30px; margin-bottom: 10px; display: flex; flex-wrap: wrap; align-items: center; }
.content .info .name{ font-size: 30rpx; flex: 1; }
.content .info .integral{ padding: 0 40rpx; background-color: rgba(0, 0, 0, 0.05); line-height: 40rpx; border-radius: 20rpx; position: relative; }
.content .info .integral .text{ font-size: 28rpx; font-weight: bold; }
.content .info .integral .icon{ position: absolute; font-size: 30rpx; line-height: 50rpx; width: 50rpx; text-align: center; top: -5rpx; left: -20rpx; border-radius: 50%; color: transparent; }

/* 菜单显示隐藏 */
.hide_menu .top{ transform: translateY(-100%); }
.hide_menu .bottom{ transform: translateY(100%); }

/* 主题 */
.theme1{ background-color: #fff; }
.theme1 .page{ background-color: #dfd8d0; color: #322b23; }
.theme1 .top { background-color: #fff; }
.theme1 .top .option_btn{ color: #383838; }
.theme1 .bottom{ background-color: #fff; }
.theme1 .content .info .name{ color: #83775c; }
.theme1 .content .info .integral{ background-color: #d7d0c8; }
.theme1 .content .info .integral .text{ color: #383838; }
.theme1 .content .info .integral .icon{ background-color: #979088; color: #dfd8d0; }
.theme1 .bottom .menu{ color: #383838; }
.theme1 .bottom .menu .theme_on{ border: 2px #383838 solid; }

.theme2{ background-color: #ded9c6; }
.theme2 .page{ background-color: #c9c0a3; color: #443109; }
.theme2 .top { background-color: #ded9c6; }
.theme2 .top .option_btn{ color: #362302; }
.theme2 .bottom{ background-color: #ded9c6; }
.theme2 .content .info .name{ color: #83775c; }
.theme2 .content .info .integral{ background-color: #c3b9a0; }
.theme2 .content .info .integral .text{ color: #362302; }
.theme2 .content .info .integral .icon{ background-color: #977e5f; color: #c9c0a3; }
.theme2 .bottom .menu{ color: #362302; }
.theme2 .bottom .menu .theme_on{ border: 2px #362302 solid; }

.theme3{ background-color: #d9e3cb; }
.theme3 .page{ background-color: #c7c7af; color: #302f1a; }
.theme3 .top { background-color: #d9e3cb; }
.theme3 .top .option_btn{ color: #252a24; }
.theme3 .bottom{ background-color: #d9e3cb; }
.theme3 .content .info .name{ color: #83775c; }
.theme3 .content .info .integral { background-color: #bfbfa7; }
.theme3 .content .info .integral .text{ color: #252a24; }
.theme3 .content .info .integral .icon{ background-color: #8f927d; color: #c7c7af; }
.theme3 .bottom .menu{ color: #252a24; }
.theme3 .bottom .menu .theme_on{ border: 2px #252a24 solid; }

.theme4{ background-color: #cbd8e1; }
.theme4 .page{ background-color: #bbbfc2; color: #454142; }
.theme4 .top { background-color: #cbd8e1; }
.theme4 .top .option_btn{ color: #353a3d; }
.theme4 .bottom{ background-color: #cbd8e1; }
.theme4 .content .info .name{ color: #83775c; }
.theme4 .content .info .integral{ background-color: #b4b8bb; }
.theme4 .content .info .integral .text{ color: #353a3d; }
.theme4 .content .info .integral .icon{ background-color: #85898c; color: #bbbfc2; }
.theme4 .bottom .menu{ color: #353a3d; }
.theme4 .bottom .menu .theme_on{ border: 2px #353a3d solid; }

.theme5{ background-color: #161616; }
.theme5 .page{ background-color: #211a12; color: #6e675f; }
.theme5 .top { background-color: #161616; }
.theme5 .top .option_btn{ color: #6f6f6f; }
.theme5 .bottom{ background-color: #161616; }
.theme5 .content .info .name{ color: #83775c; }
.theme5 .content .info .integral{ background-color: #31281d; }
.theme5 .content .info .integral .text{ color: #6f6f6f; }
.theme5 .content .info .integral .icon{ background-color: #69625a; color: #211a12; }
.theme5 .bottom .menu{ color: #6f6f6f; }
.theme5 .bottom .menu .theme_on{ border: 2px #6f6f6f solid; }
.theme5 .bottom .menu .size_btn{ background-color: rgba(255,255,255,0.1); }
</style>