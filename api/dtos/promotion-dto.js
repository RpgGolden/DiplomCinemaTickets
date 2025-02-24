export default class PromotionDto {
    id;
    description;
    discountPercentage;
    conditions;
    imageUrl;
    startDate;
    endDate;
    status;

    constructor(promotion, host) {
        this.id = promotion.id;
        this.description = promotion.description;
        this.discountPercentage = Number(promotion.discountPercentage);
        this.conditions = promotion.conditions;
        this.imageUrl = promotion.image ? `${host}/${promotion.image}` : null;
        this.startDate = promotion.startDate;
        this.endDate = promotion.endDate;
        this.status = Boolean(promotion.status);
    }
}
