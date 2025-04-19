import moment from 'moment-timezone';
export default class PromotionDto {
    id;
    title;
    description;
    imageUrl;
    isOutput;
    endDate;

    constructor(promotion, host) {
        this.id = promotion.id;
        this.title = promotion.title;
        this.description = promotion.description;
        this.imageUrl = promotion.image ? `https://ipfs.io/ipfs/${promotion.image}` : null;
        this.isOutput = Boolean(promotion.isOutput);
        this.endDate = moment(promotion.endDate).format('YYYY-MM-DD');
    }
}
