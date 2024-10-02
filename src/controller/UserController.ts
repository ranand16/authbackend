import StandardResponse from "../utils/Response";
import UserService from "../services/UserService";

export default class UserController {
    userService: UserService;
    constructor() {
        this.userService = new UserService();
    }

    public create(req: any, res: any) {
        const rowData = { ...req.body, headers: req.headers}
        this.userService
            .create(rowData)
            .then((user) => {
                return new StandardResponse()
                    .success()
                    .set("data", user)
                    .send(res);
            })
            .catch((e)=> {
                return new StandardResponse()
                    .reasonHandler(e)
                    .send(res);
            })
        
    }

    public signin(req: any, res: any) {
        const rowData = { ...req.body, headers: req.headers }
        this.userService
            .signin(rowData)
            .then((user) => {
                return new StandardResponse()
                    .success()
                    .set("data", user)
                    .send(res);
            })
            .catch((e)=> {
                return new StandardResponse()
                    .reasonHandler(e)
                    .send(res);
            })
        
    }

    public getAllUsers(req: any, res: any) {
        this.userService.getAllUsers().then((allUsers)=>{
            return new StandardResponse()
                .success()
                .set("data", allUsers)
                .send(res)
        }).catch((e)=> {
            return new StandardResponse()
                .reasonHandler(e)
                .send(res);
        })
    }

}