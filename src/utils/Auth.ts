import { Request } from "express";
import { User } from "../models/User";

export interface AuthInfoI {
    id: any;
    email: string;
    exp: any;
    iat: any;
    is_root: any;
    _user: User;
    _userAgent: string;
    _ipAddress: string;
    _req: Request;
    _deviceId: string;
    _deviceType: string;
    _clientName: string
}

export class Auth {
    static currentUser: User;
    static currentAuthInfo: AuthInfoI;
    /**
     * set IP, UserAgent in req.authInfo
     * this.setClientData(req);
     * @param req
     */
    public static setClientData(req: Request) {
        if (req.authInfo) {
            req.authInfo["_userAgent"] = req.get("user-agent");
            req.authInfo["_ipAddress"] = req.ip;
            req.authInfo["_deviceId"] = req.header('deviceId');
            req.authInfo["_deviceType"] = req.header('deviceType');
            req.authInfo["_clientName"] = req.header('ClientName');
            //@todo - we can store email from req.user.email, if we remove email from JWT
        }
    }
    public static getLoggedInUser(req: Request) {
        this.currentUser = req.user as User;
        return req.user as User;
    }

    public static getAuthInfo(req: Request) {
        this.currentAuthInfo = req.authInfo as AuthInfoI;
        return req.authInfo as AuthInfoI;
    }
}