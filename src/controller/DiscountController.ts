import StandardResponse from "../utils/Response";
import DiscountService, { DiscountCoupon } from "../services/DiscountService";

export default class DiscountController {
    discountService: DiscountService;
    constructor() {
        this.discountService = new DiscountService();
    }

    public createDiscountCoupon(req: any, res: any) {
        const rowData = { ...req.body, headers: req.headers}
        this.discountService.createDiscountCoupon(rowData).then((discountCoupon: DiscountCoupon) => {
            return new StandardResponse()
            .success()
            .set("data", discountCoupon)
            .send(res)
        }).catch((e)=> {
            return new StandardResponse()
                .reasonHandler(e)
                .send(res);
        })
    }

    public getAllDiscountCoupons(req: any, res: any) {
        this.discountService.getAllDiscountCoupons().then((allDiscountCoupons) => {
            return new StandardResponse()
                .success()
                .set("data", allDiscountCoupons)
                .send(res)
        }).catch((e)=> {
            return new StandardResponse()
                .reasonHandler(e)
                .send(res);
        })
    }
}