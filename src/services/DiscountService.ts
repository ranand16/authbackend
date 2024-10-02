import { HttpError } from "../utils/Response";
import { PromiseInterface } from "../interfaces";
import { User } from "../models/User";
import { createDiscountCoupon, generateUUID10 } from "../utils/functions";
import JWT from "jsonwebtoken";
import Config from "config";
export const allDiscountCoupons = {};

export interface DiscountCoupon {
    id: string;
    code: string;
    startfrom: number;
    nthrepeat: number;
}

export default class DiscountService {
    constructor() {}

    public createDiscountCoupon(row: any) {
        console.log("🚀 ~ DiscountService ~ createDiscountCoupon ~ row:", row)
        try {
            const discount_id: string = generateUUID10().toString();
            const discountCoupon: DiscountCoupon = {
                id: discount_id,
                code: createDiscountCoupon(),
                startfrom: Date.now(), // let's assume that each coupon gets valid once it is created
                nthrepeat: row.repeat_after
            };
            allDiscountCoupons[discount_id] = discountCoupon;
            return this.promiseResolve(discountCoupon)
        } catch (error) {
            return this.promiseReject(error)
        }
    }

    public getAllDiscountCoupons() {
        return this.promiseResolve(allDiscountCoupons);
    }

    private throwValidationError(error: any, status = 400) {
        throw new HttpError(
            "Validation Error, " + error + ". Status: " + status
        );
    }

    private promiseReject(reason: PromiseInterface | ErrorConstructor) {
        return Promise.reject(reason);
    }

    private promiseResolve(value: any) {
        return Promise.resolve(value);
    }

    private generateLoginJWT(user: User) {
        const jwtPayload = {
            ...user,
            ujwt: undefined
        }
        //algorithm used default HS256
        const jwtToken = JWT.sign(
            jwtPayload,
            Config.get("JWT.AUTH_SECRET_KEY"),
            { expiresIn: Config.get("JWT.AUTH_EXPIRES_IN") }
        );
        jwtPayload.ujwt = jwtToken;
        return jwtPayload;
    }
}