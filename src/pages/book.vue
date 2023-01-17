<template>
  <view :class="['book', showMenu ? '' : 'hide_menu', themes[bookOption.theme].className]">
    <!-- 顶部菜单 -->
    <view class="top_menu" :style="{ 'padding-top': appOption.statusBarHeight + 'px' }">
      <view class="back" @click="goBack()">
        <Icons type="arrowleft" size="22" :color="themes[bookOption.theme].text" />
      </view>
      <view class="option">
        <view class="option_btn">下载</view>
        <view class="option_btn">加入书架</view>
        <view class="option_btn">
          <Icons type="more-filled" size="18" :color="themes[bookOption.theme].text" />
        </view>
      </view>
    </view>

    <!-- 阅读内容页 -->
    <view class="content" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">

      <view
        v-for="(style, index) in styles"
        class="page"
        :key="index"
        :style="{
          'transition': style.transition,
          'transform': 'translate3d(' + style.transform + ',0px,0px)',
          'z-index': style.zIndex,
          'padding': `${styleInfo.pagePaddingTop}px ${styleInfo.pagePaddingRight}px`
        }"
      >
        <!-- 顶部状态占位 -->
        <view class="status_bar" :style="{ 'height': appOption.statusBarHeight + 'px' }"></view>

        <!-- 小说信息 -->
        <view
          class="info_box"
          :style="{
            'height': styleInfo.infoHeight + 'px',
            'margin-bottom': styleInfo.infoMarginBottom + 'px'
          }"
        >
          <view class="name">{{ `小说ID: ${bookId}` }}</view>
          <view class="integral">
            <text class="text">300币</text>
            <view class="icon">$</view>
          </view>
        </view>

        <!-- 小说标题 -->
        <view
          v-show="pageTextList[index].title"
          :style="{
            'font-size': bookOption.sizeInfo.title + 'px',
            'line-height': bookOption.sizeInfo.tLineHeight + 'px',
            'margin-bottom': bookOption.sizeInfo.margin + 'px',
          }"
        >{{ pageTextList[index].title }}</view>

        <!-- 小说段落 -->
        <view
          v-for="(p, pIndex) in pageTextList[index].content"
          :key="pIndex"
          :style="{
            'font-size': bookOption.sizeInfo.p + 'px',
            'line-height': bookOption.sizeInfo.pLineHeight + 'px',
            'margin-bottom': bookOption.sizeInfo.margin + 'px',
            'text-indent': styleInfo.indent + 'px'
          }"
        >{{ p }}</view>

      </view>

    </view>

    <!-- 底部菜单 -->
    <view class="bottom">
      <view class="switch">
        <view class="switch_icon" @click="chapterPrev()">
          <Icons type="arrowleft" size="22" :color="themes[bookOption.theme].text" />
        </view>
        <view style="flex: 1">
          <slider
            :value="chapterIndex"
            :max="chapterMax"
            :block-color="themes[bookOption.theme].text"
            :activeColor="themes[bookOption.theme].text"
            :backgroundColor="themes[bookOption.theme].slide"
            block-size="20"
            @change="sliderChapter"
          />
        </view>
        <view class="switch_icon" @click="chapterNext()">
          <Icons type="arrowright" size="22" :color="themes[bookOption.theme].text" />
        </view>
      </view>
      <view class="menu">
        <view class="menu_tip">章节位置</view>
        <view class="book_pos">第{{ chapterIndex + 1 }}章 《甄嬛传奇》</view>
      </view>
      <view class="menu">
        <view class="menu_tip">字体设置</view>
        <view class="size_setting">
          <view class="size_btn" @click="reduceFontSize()">
            <text>A-</text>
          </view>
          <view class="size_btn" @click="addFontSize()">
            <text>A+</text>
          </view>
        </view>
      </view>
      <view class="menu">
        <view class="menu_tip">背景主题</view>
        <view
          v-for="(item, index) in themes"
          :key="index"
          :class="['theme', bookOption.theme == index ? 'theme_on' : '', item.className]"
          @click="switchTheme(index)"
        ></view>
      </view>
    </view>

    <!-- 新手提示 -->
    <BookTip v-if="firstTip" @click="closeBookTip()" />
  </view>
</template>
<script lang="ts" setup>
import { computed, ref, reactive } from "vue";
import Icons from "@/components/Icons.vue";
import BookTip from "@/components/BookTip.vue";
import store from "@/store";
import { showLoading, showToast } from "@/utils/control";
import { createBookContent, paragraphSeparate } from "@/hooks/book";
import { onLoad, onReady, onUnload } from "@dcloudio/uni-app";

/** 页面过渡时间（毫秒） */
const slideTime = 260;
/** 有效拖拽时间（毫秒） */
const dragTime = 300;

const appOption = store.appOption;
/** 小说操作信息 */
const bookOption = store.bookOption;
/** 样式参数 */
const styleInfo = reactive({
  pagePaddingTop: 8,
  pagePaddingRight: 16,
  infoHeight: 30,
  infoMarginBottom: 10,
  /** 段落缩进 */
  indent: 24
});
/** 显示菜单 */
const showMenu = ref(false);
/** 页面负偏移量（负数） */
let pageSlideValue = 0;
/** 触摸位置 */
let touchPosition = 0;
/** 触摸的时间 */
let touchTime = 0;
/** 首次打开提示 */
const firstTip = ref(false);
/** 滑动计时器 */
let slideTimer: NodeJS.Timeout | null;
/** 是否开始触摸 */
let startTouch = false;
/** 页面高度 */
let pageHeight = 0;
/** 页面宽度 */
let pageWidth = 0;
/** 小数三个页面样式列表 */
const styles = ref([
  {
    transform: "-102%",
    transition: "0s all",
    zIndex: 3
  },
  {
    transform: "0px",
    transition: "0s all",
    zIndex: 2
  },
  {
    transform: "0px",
    transition: "0s all",
    zIndex: 1
  }
]);
/** 阅读器样式主题 */
const themes = ref([
  {
    className: "theme1",
    text: "#383838",
    slide: "#eeeeee"
  },
  {
    className: "theme2",
    text: "#362302",
    slide: "#d7d2bf"
  },
  {
    className: "theme3",
    text: "#252a24",
    slide: "#d0dac2"
  },
  {
    className: "theme4",
    text: "#353a3d",
    slide: "#c4d1da"
  },
  {
    className: "theme5",
    text: "#6f6f6f",
    slide: "#252525"
  },
]);
/** 最大章节数 */
const chapterMax = ref(10);
/** 章节位置（0开始） */
const chapterIndex = ref(0);
/** 章节的页数位置 */
const chapterPage = ref(0);
/** 章节阅读器数据 */
const chapterList = ref<Array<Array<{ title: string, content: Array<string> }>>>([]);
/** 
 * 请求回来的章节阅读器数据
 * - 下载的`json`也是这个
 */
let cacheData: Array<{ title: string, content: string }> = [];
/** 页面内容列表 */
const pageTextList = ref<Array<{ title: string, content: Array<string> }>>([
  {
    title: "", // "page-1",
    content: []
  },
  {
    title: "", // "page-2",
    content: []
  },
  {
    title: "", // "page-3",
    content: []
  }
]);
/** 小说id */
const bookId = ref("");
/** 是否为第一页 */
const isFirstPage = computed(() => chapterIndex.value === 0 && chapterPage.value === 0);
/** 否最后一页 */
const isLastPage = computed(() => chapterIndex.value === chapterMax.value && chapterPage.value === chapterList.value[chapterIndex.value].length - 1);

/** 关闭新手提示 */
function closeBookTip() {
  bookOption.first = firstTip.value = false;
  store.saveBookOption();
}

function goBack() {
  uni.navigateBack();
}

/**
 * 切换主题
 * @param index
 */
function switchTheme(index: number) {
  bookOption.theme = index;
  store.saveBookOption();
}

/** 重置页面（位置偏移） */
function resetPage() {
  styles.value[0].transition = "0s all";
  styles.value[0].transform = `${pageSlideValue}px`;

  styles.value[1].transition = "0s all";
  styles.value[1].transform = "0px";

  styles.value[2].transition = "0s all";
  styles.value[2].transform = "0px";
}

/** 切换到上一页 */
function pagePrev() {
  styles.value[0].transition = `${slideTime}ms all`;
  styles.value[0].transform = "0px";

  styles.value[1].transition = "0s all";
  styles.value[1].transform = "0px";

  styles.value[2].transition = "0s all";
  styles.value[2].transform = "0px";

  slideTimer = setTimeout(() => {
    if (chapterPage.value > 0) {
      chapterPage.value--;
    } else {
      chapterIndex.value--;
      chapterPage.value = chapterList.value[chapterIndex.value].length - 1;
    }
    updateContent();
    resetPage();
    clearTimeout(slideTimer!);
    slideTimer = null;
  }, slideTime);
}

/** 切换到下一页 */
function pageNext() {
  styles.value[0].transition = "0s all";
  styles.value[0].transform = `${pageSlideValue}px`;

  styles.value[1].transition = `${slideTime}ms all`;
  styles.value[1].transform = `${pageSlideValue}px`;

  styles.value[2].transition = "0s all";
  styles.value[2].transform = "0px";

  slideTimer = setTimeout(() => {
    if (chapterPage.value == chapterList.value[chapterIndex.value].length - 1) {
      chapterIndex.value++;
      chapterPage.value = 0;
    } else {
      chapterPage.value++;
    }
    updateContent();
    resetPage();
    clearTimeout(slideTimer!);
    slideTimer = null;
  }, slideTime);
}

function onTouchStart(e: TouchEvent) {
  // console.log("onTouchStart >>", e);
  if (slideTimer) return;
  startTouch = true;
  const pageX = e.touches[0].pageX;
  touchPosition = pageX;
  touchTime = Date.now();
}

function onTouchMove(e: TouchEvent) {
  if (!startTouch) return;
  if (showMenu.value) return;
  const pageX = e.touches[0].pageX;
  const slide = pageX - touchPosition;
  if (slide < 0) {
    styles.value[1].transition = "0s all";
    styles.value[1].transform = `${slide}px`;
  } else {
    styles.value[0].transition = "0s all";
    styles.value[0].transform = `${pageSlideValue + slide}px`;
  }
  // console.log("onTouchMove", slide);
}

function onTouchEnd(e: TouchEvent) {
  if (!startTouch) return;
  startTouch = false;
  if (showMenu.value) {
    showMenu.value = false;
    return;
  }
  const pageX = e.changedTouches[0].pageX;
  const now = Date.now();
  const slideX = pageX - touchPosition;
  const value = pageWidth / 3;
  /** 返回原来位置 */
  const backPosition = () => {
    styles.value[0].transition = `${slideTime}ms all`;
    styles.value[0].transform = `${pageSlideValue}px`;
    styles.value[1].transition = `${slideTime}ms all`;
    styles.value[1].transform = "0px";
  }
  // console.log("onTouchEnd", slideX);
  if (Math.abs(slideX) <= 0) {
    if (pageX < value) {
      // console.log("点击左边");
      if (isFirstPage.value) {
        showToast("没有上一页了");
      } else {
        pagePrev();
      }
    } else if (pageX > value * 2) {
      // console.log("点击右边");
      if (isLastPage.value) {
        showToast("当前小说已完结");
      } else {
        pageNext();
      }
    } else {
      // console.log("点击中间");
      showMenu.value = true;
    }
  } else {
    // console.log(now - touchTime, slideX, value);
    if (now - touchTime < dragTime || (now - touchTime > dragTime && Math.abs(slideX) >= value)) {
      if (slideX > 0) {
        // console.log("向右边滑动");
        if (isFirstPage.value) {
          showToast("没有上一页了");
          backPosition();
        } else {
          pagePrev();
        }
      } else {
        // console.log("向左边滑动");
        if (isLastPage.value) {
          showToast("当前小说已完结");
          backPosition();
        } else {
          pageNext();
        }
      }
    } else {
      // console.log("执行");
      // 重置当前页和上一页的回弹
      backPosition();
    }
  }
}

/** 上一章 */
function chapterPrev() {
  chapterIndex.value--;
  getChapterData(chapterIndex.value, res => {
    chapterPage.value = 0; // 重置章节到第一页
    updateChapterList(chapterIndex.value, res);
    updateContent();
  });
}

/** 下一章 */
function chapterNext() {
  if (chapterIndex.value === chapterMax.value) return showToast("当前小说已完结");
  chapterIndex.value++;
  getChapterData(chapterIndex.value, res => {
    chapterPage.value = 0; // 重置章节到第一页
    updateChapterList(chapterIndex.value, res);
    updateContent();
  });
}

/** 滑动切换章节 */
function sliderChapter(e: any) {
  chapterIndex.value = Number(e.detail.value);
  // console.log(chapterIndex.value);
  getChapterData(chapterIndex.value, res => {
    chapterPage.value = 0; // 重置章节到第一页
    updateChapterList(chapterIndex.value, res);
    updateContent();
  });
}

/** 加大字体 */
function addFontSize() {
  if (bookOption.sizeInfo.p >= 22) return showToast("已经是最大字体了");
  bookOption.sizeInfo.title++;
  bookOption.sizeInfo.p++;
  bookOption.sizeInfo.tLineHeight = bookOption.sizeInfo.title * 1.5;
  bookOption.sizeInfo.pLineHeight = bookOption.sizeInfo.p * 1.5;
  store.saveBookOption();

  getChapterData(chapterIndex.value, res => {
    updateChapterList(chapterIndex.value, res);
    updateContent();
  });
}

/** 缩小字体 */
function reduceFontSize() {
  if (bookOption.sizeInfo.p <= 15) return showToast("已经是最小字体了");
  bookOption.sizeInfo.title--;
  bookOption.sizeInfo.p--;
  bookOption.sizeInfo.tLineHeight = bookOption.sizeInfo.title * 1.5;
  bookOption.sizeInfo.pLineHeight = bookOption.sizeInfo.p * 1.5;
  store.saveBookOption();

  getChapterData(chapterIndex.value, res => {
    updateChapterList(chapterIndex.value, res);
    updateContent();
  });
}

/** 
 * 更新章节列表数据 
 * @param chapter 第几章
 * @param data 
 */
function updateChapterList(chapter: number, data: { title: string, content: string }) {
  /** 当前章节的段落列表 */
  const contents = data.content.split(paragraphSeparate);
  /** 下边距 */
  const margin = bookOption.sizeInfo.margin;
  /** 内容实际宽度 */
  const width = pageWidth - (styleInfo.pagePaddingRight * 2);
  /** 单个字体的宽度 */
  const sizeWidth = 1;
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
    text: ""
  };

  // 先重置为一个空的数组，因为二维数组的值初始化是`undefined`
  chapterList.value[chapter] = [];

  // console.log("页面高度", pageHeight);
  // console.log("页面实际宽度", width);

  for (let i = 0; i < contents.length; i++) {
    const item = contents[i];
    const fontWidth = item.length * (bookOption.sizeInfo.p * sizeWidth) + styleInfo.indent;
    const row = Math.ceil(fontWidth / width);
    const itemHeight = row * bookOption.sizeInfo.pLineHeight + margin;
    // console.log(`第${i + 1}段`, row + "行", fontWidth, item);
    // console.log(`第${i + 1}段`, row + "行");

    if (firstPage) {
      height += bookOption.sizeInfo.tLineHeight + margin;
      firstPage = false;
    }

    // 把上一页超出的内容加到当前页中去
    if (nextPageText.height) {
      height += nextPageText.height;
      list.push(nextPageText.text);
      // 用完拼接好的页面记得清除
      nextPageText.height = 0;
      nextPageText.text = "";
    }

    list.push(item);
    height += itemHeight;

    // 判断是否超出一页的高度
    if (height - margin > pageHeight - styleInfo.infoHeight - styleInfo.infoHeight - (styleInfo.pagePaddingTop * 2) - appOption.statusBarHeight) {
      list.pop();
      nextPageText.height = itemHeight;
      nextPageText.text = item;
      // console.log("页数:", page, "height:", height - itemHeight, "段数:", list.length);
      // 下一页
      chapterList.value[chapter][page] = {
        title: "",
        content: list
      }
      list = [];
      height = 0;
      page++;
    }

  }
  chapterList.value[chapter][0].title = data.title;
  // console.log(`第${chapter}章`, chapterList.value[chapter]);
  // 这里不能直接调用，不然在计算下一章回调时会出现死循环
  // updateContent(); 
}

/** 更新3个页面的文章内容 */
function updateContent() {
  /** 当前章节内容列表 */
  const contents = chapterList.value[chapterIndex.value];

  // 调整字体由大到小的时候，章节列表会对应的缩短，所以要检测当前章节的页数位置
  if (chapterPage.value > contents.length - 1) {
    chapterPage.value = contents.length - 1;
  }

  // 上一页显示的内容 =====================================================================
  if (isFirstPage.value) {
    pageTextList.value[0].title = "";
    pageTextList.value[0].content = [];
  } else if (chapterPage.value == 0) {
    // 写到这里...判断加载上一章的篇章
    /** 上一章 */
    const prevChapter = chapterIndex.value - 1;
    // 加载上一章
    getChapterData(prevChapter, res => {
      updateChapterList(prevChapter, res);
      /** 最后一页 */
      const lastPage = chapterList.value[prevChapter].length - 1;
      pageTextList.value[0].title = chapterList.value[prevChapter][lastPage].title;
      pageTextList.value[0].content = chapterList.value[prevChapter][lastPage].content;
    });
  } else {
    pageTextList.value[0].title = contents[chapterPage.value - 1].title;
    pageTextList.value[0].content = contents[chapterPage.value - 1].content;
  }

  // 当前显示的内容 =====================================================================
  pageTextList.value[1].title = contents[chapterPage.value].title;
  pageTextList.value[1].content = contents[chapterPage.value].content;

  // 下一页显示的内容 =====================================================================
  if (isLastPage.value) {
    // 最后一章最后一页
    pageTextList.value[2].title = "";
    pageTextList.value[2].content = [];
  } else if (chapterPage.value == contents.length - 1) {
    // console.log("当前章数", chapterPage.value, "总列表", chapterList.value);
    /** 下一章索引 */
    const nextChapter = chapterIndex.value + 1;
    // 加载下一章
    getChapterData(nextChapter, res => {
      updateChapterList(nextChapter, res);
      pageTextList.value[2].title = chapterList.value[nextChapter][0].title;
      pageTextList.value[2].content = chapterList.value[nextChapter][0].content;
    });
  } else {
    pageTextList.value[2].title = contents[chapterPage.value + 1].title;
    pageTextList.value[2].content = contents[chapterPage.value + 1].content;
  }

}

/**
 * 获取章节内容，有就从缓存中获取，没有则从接口中获取
 * @param chapter 第几章
 * @param success 成功回调
 */
function getChapterData(chapter: number, success: (res: { title: string, content: string }) => void) {
  if (cacheData[chapter]) {
    success(cacheData[chapter])
  } else {
    showLoading();
    setTimeout(() => {
      uni.hideLoading();
      const data = createBookContent(chapter);
      cacheData[chapter] = data;
      // cacheData.push(data);
      success(data);
    }, 200);
  }
}

/** 
 * 初始化页面信息 
 * @param params
 */
function init(params: { id: string }) {
  console.log("页面参数 >>", params);

  params.id && (bookId.value = params.id)

  if (bookOption.first) {
    setTimeout(() => {
      firstTip.value = true;
    }, 500);
  }

  // console.log("appOption >>", appOption);
  pageWidth = appOption.screenWidth
  pageHeight = appOption.screenHeight

  // #ifdef H5
  const page = document.querySelector(".book")!;
  console.log(page);
  pageWidth = appOption.windowWidth;
  // H5浏览器下要取最低高度才准确
  pageHeight = Math.min(page.clientHeight, appOption.windowHeight, appOption.screenHeight);
  // #endif

  pageSlideValue = -(pageWidth + 5);
  styles.value[0].transform = `${pageSlideValue}px`;
  // 获取数据
  getChapterData(chapterIndex.value, res => {
    updateChapterList(chapterIndex.value, res);
    updateContent();
  });
}

let loadParam: any;

onLoad(param => loadParam = param);

onReady(function() {
  init(loadParam);
});

onUnload(function() {
  slideTimer && clearTimeout(slideTimer);
});

</script>
<style lang="scss" scoped>
.status_bar { width: 100%; }
.book {
  width: 100%;
  height: 100vh; 
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden; 
  box-sizing: border-box;
}
/* 顶部菜单栏 */
.top_menu{ 
  width: 100%; min-height: 88rpx; position: fixed; top: 0; left: 0; z-index: 5; display: flex; flex-wrap: wrap; align-items: center; overflow: hidden; transition: .3s all; box-sizing: content-box;
  .back{ padding: 14rpx; }
  .option{ flex: 1; display: flex; flex-wrap: wrap; flex-direction: row; justify-content: flex-end; }
  .option_btn{ font-size: 30rpx; margin-right: 10rpx; padding: 10rpx; }
}

/* 菜单显示隐藏 */
.hide_menu {
  .top_menu{ transform: translateY(-100%); }
  .bottom{ transform: translateY(100%); }
}

/* 底部菜单栏 */
.bottom{ 
  position: fixed; bottom: 0; left: 0; width: 100%; transition: .3s all; z-index: 6; padding: 30rpx 0; 
  .switch{ width: 100%; display: flex; flex-wrap: wrap; align-items: center; margin-bottom: 20rpx; }
  .switch_icon{ padding: 14rpx; }
  .menu{ 
    width: 100%; height: 100rpx; display: flex; flex-wrap: wrap; align-items: center; 
    .menu_tip{ font-size: 24rpx; padding: 0 40rpx; }
    .theme{ 
      width: 66rpx; height: 66rpx; border-radius: 50%; margin-right: 50rpx; box-sizing: border-box; 
      &:nth-child(6) { margin-right: 0; }
    }
    .book_pos{ font-size: 30rpx; }
    .size_setting{ flex: 1; display: flex; flex-wrap: wrap; align-items: center; }
    .size_btn{ flex: 1; text-align: center; line-height: 70rpx; font-size: 30rpx; margin-right: 30rpx; border-radius: 35rpx; background-color: rgba(0,0,0,0.1); }
  }
}

/* 内容容器 */
.content{ 
  width: 100%; height: 100%; position: relative; 
  .page{ width: 100%; height: 100%; box-sizing: border-box; box-shadow: 0 5px 10px rgba(0,0,0,0.5); position: absolute; top: 0; left: 0; overflow: hidden; }
  .info_box{ 
    width: 100%; display: flex; flex-wrap: wrap; align-items: center; 
    .name{ font-size: 30rpx; flex: 1; }
    .integral{ 
      padding: 0 40rpx; background-color: rgba(0, 0, 0, 0.05); line-height: 40rpx; border-radius: 20rpx; position: relative; 
      .text{ font-size: 28rpx; font-weight: bold; }
      .icon{ position: absolute; font-size: 30rpx; line-height: 50rpx; width: 50rpx; text-align: center; top: -5rpx; left: -20rpx; border-radius: 50%; color: transparent; }
    }
  }
}

/* 主题 */
.theme1{ background-color: #fff; }
.theme1 .page{ background-color: #dfd8d0; color: #322b23; }
.theme1 .top_menu { background-color: #fff; }
.theme1 .top_menu .option_btn{ color: #383838; }
.theme1 .bottom{ background-color: #fff; }
.theme1 .content .info_box .name{ color: #83775c; }
.theme1 .content .info_box .integral{ background-color: #d7d0c8; }
.theme1 .content .info_box .integral .text{ color: #383838; }
.theme1 .content .info_box .integral .icon{ background-color: #979088; color: #dfd8d0; }
.theme1 .bottom .menu{ color: #383838; }
.theme1 .bottom .menu .theme_on{ border: 2px #383838 solid; }

.theme2{ background-color: #ded9c6; }
.theme2 .page{ background-color: #c9c0a3; color: #443109; }
.theme2 .top_menu { background-color: #ded9c6; }
.theme2 .top_menu .option_btn{ color: #362302; }
.theme2 .bottom{ background-color: #ded9c6; }
.theme2 .content .info_box .name{ color: #83775c; }
.theme2 .content .info_box .integral{ background-color: #c3b9a0; }
.theme2 .content .info_box .integral .text{ color: #362302; }
.theme2 .content .info_box .integral .icon{ background-color: #977e5f; color: #c9c0a3; }
.theme2 .bottom .menu{ color: #362302; }
.theme2 .bottom .menu .theme_on{ border: 2px #362302 solid; }

.theme3{ background-color: #d9e3cb; }
.theme3 .page{ background-color: #c7c7af; color: #302f1a; }
.theme3 .top_menu { background-color: #d9e3cb; }
.theme3 .top_menu .option_btn{ color: #252a24; }
.theme3 .bottom{ background-color: #d9e3cb; }
.theme3 .content .info_box .name{ color: #83775c; }
.theme3 .content .info_box .integral { background-color: #bfbfa7; }
.theme3 .content .info_box .integral .text{ color: #252a24; }
.theme3 .content .info_box .integral .icon{ background-color: #8f927d; color: #c7c7af; }
.theme3 .bottom .menu{ color: #252a24; }
.theme3 .bottom .menu .theme_on{ border: 2px #252a24 solid; }

.theme4{ background-color: #cbd8e1; }
.theme4 .page{ background-color: #bbbfc2; color: #454142; }
.theme4 .top_menu { background-color: #cbd8e1; }
.theme4 .top_menu .option_btn{ color: #353a3d; }
.theme4 .bottom{ background-color: #cbd8e1; }
.theme4 .content .info_box .name{ color: #83775c; }
.theme4 .content .info_box .integral{ background-color: #b4b8bb; }
.theme4 .content .info_box .integral .text{ color: #353a3d; }
.theme4 .content .info_box .integral .icon{ background-color: #85898c; color: #bbbfc2; }
.theme4 .bottom .menu{ color: #353a3d; }
.theme4 .bottom .menu .theme_on{ border: 2px #353a3d solid; }

.theme5{ background-color: #161616; }
.theme5 .page{ background-color: #211a12; color: #6e675f; }
.theme5 .top_menu { background-color: #161616; }
.theme5 .top_menu .option_btn{ color: #6f6f6f; }
.theme5 .bottom{ background-color: #161616; }
.theme5 .content .info_box .name{ color: #83775c; }
.theme5 .content .info_box .integral{ background-color: #31281d; }
.theme5 .content .info_box .integral .text{ color: #6f6f6f; }
.theme5 .content .info_box .integral .icon{ background-color: #69625a; color: #211a12; }
.theme5 .bottom .menu{ color: #6f6f6f; }
.theme5 .bottom .menu .theme_on{ border: 2px #6f6f6f solid; }
.theme5 .bottom .menu .size_btn{ background-color: rgba(255,255,255,0.1); }
</style>