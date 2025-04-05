export default class NewsDto {
    id;
    title;
    content;
    imageUrl;
    status;

    constructor(news, host) {
        this.id = news.id;
        this.title = news.title;
        this.content = news.content;
        this.imageUrl = news.image ? `${host}/${news.image}` : null;
        this.status = Boolean(news.status);
    }
}
