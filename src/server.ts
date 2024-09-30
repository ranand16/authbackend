/**
 * @author Rishabh Anand
 */

import express from "express";
import compression from "compression";
import cors from "cors";
import * as bodyParser from "body-parser";
import StandardResponse from "./utils/Response"; 

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
        const a = Server.app;
        
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
        
        Server.app.options("/*", function (req, res, next) {
            console.log("req.body ------- ",req.body);
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