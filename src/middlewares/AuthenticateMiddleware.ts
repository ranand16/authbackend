import { NextFunction, Request, Response } from "express";
import { Auth } from "../utils/Auth";
import StandardResponse from "../utils/Response";

export default class AuthenticateMiddleware {

    public static async validateAccess(req: Request, res: Response, next: NextFunction) {
        try {
            Auth.setClientData(req);
            const jwtPayload = Auth.getAuthInfo(req);
            if (
                !jwtPayload ||
                !jwtPayload.id
            ) {
                return new StandardResponse()
                    .error()
                    .set(
                        "errorMsg",
                        "Not a valide auth token...jwtpayload data is incorrect"
                    )
                    .set("status", 401)
                    .send(res);
            }
            return next();
        } catch (error) {
            return new StandardResponse()
                    .reasonHandler(
                        new Error("Not Authorized to access this resource.")
                    )
                    .set("status", 401)
                    .send(res);
        }
    }

    public static async validateRootAccess(req: Request, res: Response, next: NextFunction) {
        try {
            Auth.setClientData(req);
            const jwtPayload = Auth.getAuthInfo(req);
            if (
                !jwtPayload.is_root ||
                !jwtPayload ||
                !jwtPayload.id
            ) {
                return new StandardResponse()
                    .error()
                    .set(
                        "errorMsg",
                        "You're not a root user..."
                    )
                    .set("status", 401)
                    .send(res);
            }
            return next();
        } catch (error) {
            return new StandardResponse()
                    .reasonHandler(
                        new Error("Not Authorized to access this resource.")
                    )
                    .set("status", 401)
                    .send(res);
        }
    }
}