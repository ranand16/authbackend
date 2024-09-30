import { HttpError } from "../utils/Response";
import { PromiseInterface } from "../interfaces";
import { User } from "../models/User";
import { generateUUID10 } from "../utils/functions";
import JWT from "jsonwebtoken";
import Config from "config";

const allUsers = [];


export default class UserService {
    loggedInUser: User;
    constructor() {
        
    }

    public async create(row: any) {
        try {
            // Check if user object is in the request
            if(!row.user) this.throwValidationError("User object not found in payload")

            // Check user object in request username and password exists
            if(!(row.user.username && row.user.password)) this.throwValidationError("Username/Password not found in payload")
            
            // Check user with same username exists
            const filterUser = allUsers.filter((user)=>{
                const reqUser = row.user;
                if(reqUser.username === user.username) return user
            })
            
            if(filterUser.length > 0) this.throwValidationError("User with same username exists");
            
            if(row.user.password) {
                // do encryption or anything with the password 
            }

            // Insert user in the users object  
            const newuser: User = {
                id: generateUUID10(),
                username: row.user.username,
                email: row.user.email,
                name: row.user.name,
                password: row.user.password
            }

            // adding this user to allusers array
            allUsers.push(newuser);
            // response
            return this.promiseResolve(newuser);
        } catch(e) {
            return this.promiseReject(e)
        }
    }

    public async signin(row: any) {
        try {
            // Checking if user object is present
            if(!row.user) this.throwValidationError("User object not found in payload")
            // Checking if username and password is present in the request body
            if(!(row.user.username && row.user.password)) this.throwValidationError("Username/Password not found in payload")

            // Check if the username exists             
            const filterUser: User[] = allUsers.filter((user)=>{
                const reqUser = row.user;
                if(reqUser.username === user.username) return user
            })
            if(filterUser.length < 1) this.throwValidationError("Username not found in records, Please signup!!");
            
            // Check if the username has this password
            const userTryingToLogIn = filterUser[0];
            let resp = {
                user: null,
                message: "Not logged in!",
                jwt: null
            };
            if(userTryingToLogIn.password === row.user.password) {
                // create a jwt for this user 
                let jwtPayload = await this.generateLoginJWT(userTryingToLogIn);


                // response
                resp = {
                    user: userTryingToLogIn,
                    message: "Login successful",
                    jwt: jwtPayload
                };
                return this.promiseResolve(resp);
            }
            throw new HttpError('Internal Server Error', 500)
        } catch(e) {
            return this.promiseReject(e)
        }
    }

    private throwValidationError(error: any, status = 400) {
        throw new HttpError(
            "Validation Error, " + error + ". Status: " + status
        );
    }

    private promiseReject(reason: PromiseInterface | ErrorConstructor) {
        return Promise.reject(reason);
    }

    private promiseResolve(value: any) {
        return Promise.resolve(value);
    }

    private generateLoginJWT(user: User) {
        const jwtPayload = {
            ...user,
            ujwt: undefined
        }
        //algorithm used default HS256
        const jwtToken = JWT.sign(
            jwtPayload,
            Config.get("JWT.AUTH_SECRET_KEY"),
            { expiresIn: Config.get("JWT.AUTH_EXPIRES_IN") }
        );
        jwtPayload.ujwt = jwtToken;
        return jwtPayload;
    }
}