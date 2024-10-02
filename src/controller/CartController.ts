import CartService from "../services/CartService";
import StandardResponse from "../utils/Response";

export default class CartController {
    cartService: CartService;
    constructor(){
        this.cartService = new CartService();
    }

    public addProductToCart(req: any, res: any) {
        const rowData = { ...req.body, user: req.user , headers: req.headers, ip: req.ip }
        this.cartService
            .addProductToCart(rowData)
            .then((updatedCart) => {
                return new StandardResponse()
                    .success()
                    .set("data", updatedCart)
                    .send(res);
            })
            .catch((e)=> {
                return new StandardResponse()
                    .reasonHandler(e)
                    .send(res);
            })

    }

    public checkoutCart(req: any, res: any) {
        console.log("🚀 ~ CartController ~ checkoutCart ~ req.body:", req.body)
        const rowData = { ...req.body, user: req.user , headers: req.headers, ip: req.ip }
        this.cartService
            .checkoutCart(rowData)
            .then((orderDetails) => {
                return new StandardResponse()
                    .success()
                    .set("data", orderDetails)
                    .send(res);
            })
            .catch((e)=> {
                return new StandardResponse()
                    .reasonHandler(e)
                    .send(res);
            })
    }
}