/**
 * @author Rishabh Anand
 */

import express, { NextFunction, Request, Response } from "express";
import compression from "compression";
import cors from "cors";
import * as bodyParser from "body-parser";
import StandardResponse from "./utils/Response"; 
import UserController from "./controller/UserController";
import AuthenticateMiddleware from "./middlewares/AuthenticateMiddleware";
import passport from "passport";
import PassportMiddleware from "./middlewares/PassportMiddleware";
import CartController from "./controller/CartController";

class Server {
    public static selfInstance: Server = null;
    public static app: express.Application = null;
    public static config: any = null;

    /**
     * Returns the instance of this class
     */
    public static getInstance() {
        if (Server.selfInstance) {
            return Server.selfInstance;
        }
        console.log("server instance created");
        return new Server();
    }

    public getApp(): express.Application {
        return Server.app;
    }


    /**
     * application config
     */
    public init(): void {
        this.loadMiddlewares(); // load all required middlewares
        this.loadRoutes(); // load all routes
        // handle any internal server error
        Server.app.use(function (err: any, req: any, res: any, next: any) {
            if (!err) {
                return next();
            }
            return new StandardResponse().error()
                .set("status", 500) // overriding the default value of 400
                .set("errorMsg", "Oops, something went wrong.") // overridfing the server error message
                .send(res);
        });        
    }


    /**
     * private constructor
     */
    private constructor() {
        Server.app = express();
        this.init();
    }
    /**
     * Loads aplication routes
     */
    public loadRoutes(): void {
        const app = Server.app;
        // public routes
        app.use(express.static("public")); // exposing public route if any 
        app.all("*", (req, res, next) => next());

        app.get(
            ["/test", "/healthcheck"],
            (req: Request, res: Response, next: NextFunction) => {
                res.setHeader("Content-Type", "application/json");
                res.send({ status: 200, message: "It's Success" });
            }
        );

        app.post(
            "/v1/signup",
            (req: Request, res: Response, next: NextFunction) => {
                console.log("Signup started...");
                return new UserController().create(req, res);
            }
        )

        app.post(
            "/v1/signin",
            (req: Request, res: Response, next: NextFunction) => {
                console.log("Signing someone in...");
                return new UserController().signin(req, res);
            }
        )

        app.post(
            "/v1/allUsers",
            (req: Request, res: Response, next: NextFunction) => {
                console.log("Getting all users data...");
                return new UserController().getAllUsers(req, res);
            }
        )

        

        /**
         * APIS beyond this are authenticate protected
         */
        app.use(
            passport.authenticate("jwt", { session: false }),
            (req: Request, res: Response, next: NextFunction) => AuthenticateMiddleware.validateAccess(req, res, next)
        )

        app.post(
            "/v1/authtest",
            (req: Request, res: Response, next: NextFunction) => {
                res.json({ success: true })
            }
        )


        /**
         * Adds new items to the cart id for partiucluar user 
         */

        app.post(
            "/v1/cart/addToCart",
            (req: Request, res: Response) => new CartController().addProductToCart(req, res)
        )

        app.post(
            "/v1/cart/checkoutCart",
            (req: Request, res: Response) => new CartController().checkoutCart(req, res)
        )

        /**
         * APIS beyond this will be only for admin users
         */
        app.use((req: Request, res: Response, next: NextFunction) => AuthenticateMiddleware.validateRootAccess(req, res, next))

        app.post(
            "/v1/roottest",
            (req: Request, res: Response, next: NextFunction) => {
                res.json({ success: "You're a root user! welcome !" })
            }
        )

        /**
         * Add new discount code, currently will add to the 
         */
        app.post(
            "/v1/admin/discount/generate",
            (req: Request, res: Response) => {
                res.json({ success: "This is a new discount code!" })
            }
        )

        app.post(
            "/v1/admin/discount/analytics",
            (req: Request, res: Response) => {
                res.json({ success: "This is discount analytics!" })
            }
        )
    }

    /**
     * This loads the middlewares
     */
    private loadMiddlewares(): void {
        Server.app.use(compression());
        Server.app.use(cors({
            origin: '*'
        }));
        Server.app.use(bodyParser.json());
        Server.app.use(bodyParser.urlencoded({ extended: true }));
        new PassportMiddleware(Server.app);
        
        Server.app.options("/*", function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header(
                "Access-Control-Allow-Methods",
                "GET,PUT,POST,DELETE,OPTIONS"
            );
            res.header(
                "Access-Control-Allow-Headers",
                "Content-Type, Authorization, Content-Length, X-Requested-With"
            );
            res.send(200);
        });
    }

}

export default Server.getInstance();