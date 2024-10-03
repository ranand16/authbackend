import { NextFunction, Request, Response } from "express";
import passport from "passport";
import passportJWT from "passport-jwt";
import Config from "config";
import { AuthInfoI } from "../utils/Auth";
import { User } from "../models/User";
import { allUsers } from "../services/UserService";
export default class PassportMiddleware {
    constructor(app: any) {
        app.use(
            passport.initialize(),
            (req: Request, res: Response, next: NextFunction) => {
                res.on("finish", () => {
                    // do something if yu want
                })
                next();
            }
        )
        this.setStrategy();
    }

    private setStrategy() {
        const JWTStrategy = passportJWT.Strategy;
        const ExtractJWT = passportJWT.ExtractJwt;
        passport.use(
            new JWTStrategy(
                {
                    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
                    secretOrKey: Config.get("JWT.AUTH_SECRET_KEY")
                },
                function (jwtPayload: AuthInfoI, done) {
                    const thisuserArr = Object.values(allUsers).filter((user: User)=> {
                        return user.id === jwtPayload.id
                    })
                    const thisuser = thisuserArr[0];
                    if (!thisuser) {
                        return done(null, false, {
                            message: Config.get("MESSAGES.USER_NOT_EXIST"),
                        });
                    }
                    
                    const userJSON: any = thisuser
                    userJSON.jwtPayload = jwtPayload;
                    delete userJSON.password;
                    return done(null, userJSON, jwtPayload);
                }
            )
        );
    }
}