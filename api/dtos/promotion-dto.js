export default class PromotionDto {
    id;
    title;
    description;
    imageUrl;
    isOutput;

    constructor(promotion, host) {
        this.id = promotion.id;
        this.title = promotion.title;
        this.description = promotion.description;
        this.imageUrl = promotion.image ? `${host}/${promotion.image}` : null;
        this.isOutput = Boolean(promotion.isOutput);
    }
}
