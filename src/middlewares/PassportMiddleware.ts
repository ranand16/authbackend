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
                    console.log("Auth user:: done!");
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
                    console.log("🚀 ~ PassportMiddleware ~ setStrategy ~ jwtPayload:", jwtPayload)
                    const thisuserArr = allUsers.filter((user: User)=> {
                        console.log(user.id, " --- ",  jwtPayload.id);
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