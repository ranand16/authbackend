import { Cart, Order } from "../services/CartService";

export class User {
    public id: string;
    public name: string;
    public username: string;
    public password: string;
    public email: string;
    public is_root: boolean;
    public carts: Array<Cart>;
    public orders: Array<Order>;
}
