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
        this.imageUrl = news.image ? `https://ipfs.io/ipfs/${news.image}` : null; // Формируем ссылку на IPFS
        this.status = Boolean(news.status);
    }
}
