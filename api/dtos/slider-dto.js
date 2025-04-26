export default class SliderDto {
    id;
    imageUrl;
    priority;
    status;
    createdAt;

    constructor(slider, host) {
        this.id = slider.id;
        this.imageUrl = slider.image ? `https://ipfs.io/ipfs/${slider.image}` : null; // Формируем ссылку на IPFS
        this.priority = slider.priority;
        this.status = Boolean(slider.status);
        this.createdAt = slider.createdAt;
    }
}
