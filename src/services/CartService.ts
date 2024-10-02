import { HttpError } from "../utils/Response";
import { PromiseInterface } from "../interfaces";
import { generateUUID10 } from "../utils/functions";
import { User } from "../models/User";

import { ALL_USERS } from "../utils/constants";
import { allUsers } from "./UserService";

export interface Product {
    id: string; // product id
    cost: number;
    currency: 'rs' // future options
}

export interface Item extends Product {
    qty: number;
}

export interface Order {
    id: string; // order id
    cart_id: string; // cart id which order is placed
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

            if(!(cart && cart.id) && cart.items.length < 1) {
                return this.throwValidationError("No items found in cart. Checkout incomplete!!")
            }

            // let last_discountOrder: Order;
            // userOrders.map((o: Order, i) => {
            //     last_discountOrder = o;
            // });
            // const last_discount_index = userOrders.lastIndexOf(last_discountOrder);
            // console.log("🚀 ~ CartService ~ checkoutCart ~ last_discount_index:", last_discount_index)

            // check if this is the nth order
            // if(userOrders.)

            let newOrder: Order;
            newOrder = {
                id: generateUUID10().toString(),
                cart_id: cart.id,
                user_id: cart.user_id,
                cart: cart,
                currency: "rs",
                total_amount: cart.total_cost,
                bill: cart.total_cost,
                discount_applied: false
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