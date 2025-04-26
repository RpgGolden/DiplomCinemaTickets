export default class SliderDto {
    id;
    imageUrl;
    createdAt;

    constructor(slider, host) {
        this.id = slider.id;
        this.imageUrl = slider.image ? `https://ipfs.io/ipfs/${slider.image}` : null; // Формируем ссылку на IPFS
        this.createdAt = slider.createdAt;
    }
}
