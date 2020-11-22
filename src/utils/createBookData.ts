import utils from "./index";

/** 书本id */
let bookId = 0;

/** 图片列表 */
const images = [
    "https://muse-ui.org/img/sun.a646a52d.jpg",
    "https://muse-ui.org/img/carousel1.dc6ba9d4.jpg",
    "https://muse-ui.org/img/camera.1c54930e.jpg",
    "https://muse-ui.org/img/hats.04a08b20.jpg",
    "https://muse-ui.org/img/honey.6810375b.jpg"
];

/**
 * 小说数据类型
 */
export interface BookInfo {
    id: number
    index: number
    /** 封面图 */
    thumb: string
    /** 小说名 */
    name: string
    /** 描述 */
    info: string
    /** 评分 */
    score: string
    /** 标签 */
    label: string
    /** 小说热度 */
    value: string
}

/**
 * 创建单个小说数据
 */
export function createBookInfo() {
    const data: BookInfo = {
        id: 0,
        index: 0,
        thumb: "",
        name: "",
        info: "",
        score: "",
        label: "",
        value: "",
    }
    return data;
}

/**
 * 创建小说列表数据
 * @param index 索引开始
 * @param total 列表总数
 */
export function createBookListData(index: number = 0, total: number = 8) {
    const list: Array<BookInfo> = [];
    const titleStr = "小说名小说名小说名";
    const decStr = "小说描述小说描述小说描述小说描述";
    for (let i = index; i < index + total; i++) {
        bookId ++;
        list.push({
            id: bookId,
            index: i,
            thumb: images[Math.floor(Math.random() * images.length)],
            name: `小说${bookId} ${titleStr.slice(Math.floor(Math.random() * titleStr.length))}`,
            info: `小说描述${decStr.slice(Math.floor(Math.random() * decStr.length))}`,
            score: `${(Math.floor(Math.random() * 100) / 10).toFixed(1)}`,
            label: "都市·穿越·完结·29万人在读",
            value: "785万热度",
        });
    }
    return list;
}

/** 段落分隔符 */
export const paragraphSeparate = "<br /><br />";

/** 
 * 创建阅读器内容信息（一个章节） 
 * @param index 
*/
export function createBookContent(index: number) {
    function outputText() {
        const total = utils.ranInt(1, 5);
        let text = "";
        for (let i = 0; i < total; i++) {
            text +=  utils.randomText(2, 10);
            if (i == total - 1) {
                text += "。" + paragraphSeparate;
            } else {
                text += "，";
            }
        }
        return text;
    }
    function outputParagraph() {
        let paragraph = "";
        const total = utils.ranInt(30, 50);
        for (let i = 0; i < total; i++) {
            paragraph += outputText();
        }
        return paragraph;
    }
    
    return {
        title: `第${index + 1}章节`,
        content: outputParagraph()
    };

}