export default class SliderDto {
    id;
    imageUrls;

    constructor(slider, host) {
        this.id = slider.id;
        this.imageUrls = slider.images ? slider.images.map(image => `https://ipfs.io/ipfs/${image}`) : [];
    }
}
