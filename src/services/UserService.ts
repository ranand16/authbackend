import { HttpError } from "../utils/Response";
import { PromiseInterface } from "../interfaces";
import { User } from "../models/User";
import { generateUUID10 } from "../utils/functions";

const allUsers = [];


export default class UserService {
    loggedInUser: User;
    constructor() {
        
    }

    public async create(row: any) {
        try {
            // check if user object is in the request
            if(!row.user) {
                throw new HttpError(
                    "User object not found in payload",
                    400
                )
            }

            // Check user object in request username and password exists
            if(!(row.user.username && row.user.password)) {
                throw new HttpError(
                    "Username/Password not found in payload",
                    400
                )
            }
            
            // Check user with same username exists
            const filterUser = allUsers.filter((user)=>{
                const reqUser = row.user;
                if(reqUser.username === user.username) return user
            })
            
            if(filterUser.length > 0) {
                throw new HttpError(
                    'User with same username exists',
                    400
                )
            }
            
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

    private promiseReject(reason: PromiseInterface | ErrorConstructor) {
        return Promise.reject(reason);
    }

    private promiseResolve(value: any) {
        return Promise.resolve(value);
    }
}