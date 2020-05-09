import utils from './utils';

/** 书本id */
let bookId = 0;

/** 图片列表 */
const images = ['/static/book_1.jpg',
'/static/book_2.jpg',
'/static/book_3.jpg',
'/static/book_4.jpg',
'/static/book_5.jpg'];

export function createBookInfo() {
    const data = {
        id: 0,
        index: 0,
        /** 封面图 */
        thumb: '',
        /** 小说名 */
        name: '',
        /** 描述 */
        info: '',
        /** 评分 */
        score: '',
        /** 标签 */
        label: '',
        /** 小说热度 */
        value: '',
    }
    return data;
}

/**
 * 创建小说列表数据
 * @param {number} index 索引开始
 * @param {number} total 列表总数
 */
export function createBookListData(index = 0, total = 8) {
    const list = [];
    const titleStr = '小说名小说名小说名';
    const decStr = '小说描述小说描述小说描述小说描述';
    for (let i = index; i < index + total; i++) {
        bookId ++;
        const item = createBookInfo();
        item.id = bookId;
        item.index = i;
        item.thumb = images[Math.floor(Math.random() * images.length)];
        item.name = `小说${bookId} ${titleStr.slice(Math.floor(Math.random() * titleStr.length))}`;
        item.info = `小说描述${decStr.slice(Math.floor(Math.random() * decStr.length))}`;
        item.score = `${(Math.floor(Math.random() * 100) / 10).toFixed(1)}`;
        item.label = '都市·穿越·完结·29万人在读';
        item.value = '785万热度';
        list.push(item);
    }
    return list;
}

/** 段落分隔符 */
export const paragraphSeparate = '<br /><br />';

/** 
 * 创建阅读器内容信息（一个章节） 
 * @param {number} index 
*/
export function createBookContent(index) {
    function outputText() {
        const total = utils.ranInt(1, 5);
        let text = '';
        for (let i = 0; i < total; i++) {
            text +=  utils.randomText(2, 10);
            if (i == total - 1) {
                text += '。' + paragraphSeparate;
            } else {
                text += '，';
            }
        }
        return text;
    }
    function outputParagraph() {
        let paragraph = '';
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