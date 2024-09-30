import StandardResponse from "../utils/Response";
import UserService from "../services/UserService";

export default class UserController {
    userService: UserService;
    constructor() {
        this.userService = new UserService();
    }

    public create(req: any, res: any) {
        const rowData = { ...req.body, headers: req.headers, ip: req.ip, user: req.body.user, type: req.body.type}
        this.userService
            .create(rowData)
            .then((user) => {
                return new StandardResponse()
                    .success()
                    .set("data", user)
                    .send(res);
            })
            .catch((e)=> {
                console.log("🚀 ~ UserController ~ create ~ e:", e)
                return new StandardResponse()
                    .reasonHandler(e)
                    .send(res);
            })
        
    }

    public signin(req: any, res: any) {
        const rowData = { ...req.body, headers: req.headers, ip: req.ip, user: req.body.user, type: req.body.type}
        this.userService
            .signin(rowData)
            .then((user) => {
                return new StandardResponse()
                    .success()
                    .set("data", user)
                    .send(res);
            })
            .catch((e)=> {
                console.log("🚀 ~ UserController ~ create ~ e:", e)
                return new StandardResponse()
                    .reasonHandler(e)
                    .send(res);
            })
        
    }

}