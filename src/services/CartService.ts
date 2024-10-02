import { HttpError } from "../utils/Response";
import { PromiseInterface } from "../interfaces";
import { generateUUID10 } from "../utils/functions";
import { User } from "../models/User";

import { ALL_USERS } from "../utils/constants";
import { allUsers } from "./UserService";
import { allDiscountCoupons } from "./DiscountService";

export interface Product {
    id: string; // product id
    cost: number;
    currency: 'rs' // future options
}

export interface Item extends Product {
    qty: number;
}

export interface Cart {
    id: string; // cart id
    user_id: string;
    items?: Array<Item>,
    total_cost?: number;
}

export interface Order {
    id: string;
    cart_id: string;
    user_id: string;
    cart: Cart;
    total_amount: number;
    currency: 'rs'; // future options
    discount_applied: boolean;
    discount_code?: string;
    discount?: number;
    bill: number;
    timestamp: number;
}

export const allCarts = {};
export const allOrders = {};


export default class CartService {
    constructor() {}

    public async addProductToCart(row: any) {
        try {
            let newCart: Cart;
            const user_id = row.user.id;
            if(!row?.cart.id && row?.cart.items.length < 1) {
                return this.throwValidationError("No items found in cart!!")
            }
            // if row. id is not there, create a new cart
            if(!row.cart.id) {
                const total_cost = row?.cart?.items.reduce((total: number, current: Item)=> total+(current["cost"]*current["qty"]) , 0);
                newCart = {
                    id: generateUUID10().toString(),
                    user_id: user_id,
                    items: row?.cart.items,
                    total_cost: total_cost,
                }
                // updating carts data with the new cart
                allCarts[newCart.id] = newCart;
                allUsers[user_id]["carts"] = [...allUsers[user_id]["carts"], newCart];
        } else {
                if(!allCarts[row?.cart.id]) throw new HttpError("This cart doesnot exist", 400)
                // Do any DATA SANITIZATION / CHECKS / VALIDATION here like any specific data validations etc..
                // FOR NOW I'm considering mostly happy paths and CRICTICAL scenarios only 
                const newItems: Item[] = [...allCarts[row?.cart.id]["items"], ...row?.cart.items];
                const total_cost = newItems.reduce((total: number, current: Item)=> total+(current["cost"]*current["qty"]) , 0);

                // if row.id is there, then add the item to that cart
                newCart = {
                    ...allCarts[row?.cart.id], // current stufff in the cart
                    total_cost: total_cost, // might need checks and sanitization
                    items: newItems // this needs sanitization
                }
                // updating carts data with the new cart
                allCarts[row?.cart.id] = newCart;
                const newCarts = [...allUsers[user_id]["carts"]].map((cart: Cart)=> {
                    if(cart.id === row?.cart.id) return newCart;
                    else cart
                });
                allUsers[user_id]["carts"] = newCarts;
            }
            // adding these cart items to the users carts
            return this.promiseResolve(newCart);
        } catch(e) {
            return this.promiseReject(e)
        }
    }

    public async checkoutCart(row: any) {

        try {
            const user: User = row?.user;
            const userCarts: Array<Cart> = user.carts;
            const userOrders: Array<Order> = user.orders;

            const cart_id: string = row?.cart_id;
            const filcarts: Cart[] = userCarts.filter(c => c.id === cart_id);
            const cart = filcarts[0];

            let discount_applied: boolean = false;
            let discount_code;
            let discount: number = 0;
            
            if(!(cart && cart.id) && cart?.items && cart?.items?.length < 1) {
                return this.throwValidationError("No items found in cart. Checkout incomplete!!")
            }
            let bill = cart.total_cost;

            // BY DEFAULT I WILL PICK UP ALWAYS the first DISCOUNT COUPON
            // fetch discount codes and check if there is any discount code in the db
            const allDiscounts = Object.values(allDiscountCoupons);
            if(allDiscounts.length > 0) {
                console.log("🚀 ~ CartService ~ checkoutCart ~ allDiscountCoupons:", allDiscountCoupons);
                const discountObj = allDiscounts[0]; // BY DEFAULT I WILL PICK UP ALWAYS the first DISCOUNT COUPON
                const dis_id = discountObj["id"];
                const dis_code = discountObj["code"];
                const dis_startfrom = discountObj["startfrom"];
                const dis_nthrepeat = discountObj["nthrepeat"];

                const ordersAfterDiscountStart = userOrders.filter((uo) => uo.timestamp >= dis_startfrom);
                const latestDiscountOrder = ordersAfterDiscountStart
                    .filter(uo => uo.discount_applied)
                    .reduce((latest, current) => {
                        return (current.timestamp > latest.timestamp) ? current : latest;
                    }, { timestamp: 0 });
                // Filter orders that come after the latest discount was applied
                const noDiscountOrders = ordersAfterDiscountStart.filter(order => order.timestamp > latestDiscountOrder.timestamp);


                // There are 2 cases, both has same code to be applied but different condition needs to be checked 
                // case 1. if discount code will be applied for the 1st time 
                // if order has no discount applied before 
                // check the number of orders done after the discount code was created

                // case 2. if discount code will be applied after 1st time
                // check number of orders done after the previous discount applied order                
                // Check if the count of non-discounted orders is a multiple of nthrepeat
                if((ordersAfterDiscountStart.length + 1 === dis_nthrepeat) || (noDiscountOrders.length > 0 && (noDiscountOrders.length + 1) % dis_nthrepeat === 0)) { // this is the first nth order for this person
                    discount_applied = true;
                    discount_code = dis_code;
                    discount = cart.total_cost * 0.1; // 10% discount, this can also be added to discount creation flow 
                    bill = bill - discount;
                }

                
                
            }

            let newOrder: Order;
            newOrder = {
                id: generateUUID10().toString(),
                cart_id: cart.id,
                user_id: cart.user_id,
                currency: "rs",
                total_amount: cart.total_cost,
                bill: bill,
                timestamp: Date.now(),
                discount_applied: discount_applied,
                discount: discount,
                discount_code: discount_code,
                cart: cart,
            }
            allUsers[cart.user_id]["orders"] = [...allUsers[cart.user_id]["orders"], newOrder];

            return this.promiseResolve(newOrder);
        } catch(e) {
            return this.promiseReject(e)
        }
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
}
