import { response } from "express";

class StandardResponse {
    private resHeader: any = {
        "content-type": "application/json",
    };

    /**
     * Sandard response
     */
    private s: any = {
        status: 200, 
        statusMsg: "OK",
        data: ""
    }

    /**
     * Sandard Error response
     */
    private e: any = {
        status: 400, 
        statusMsg: "FAILED",
        data: "Something went wrong!"
    }

    /**
     * Standard notfound response
     */
    private nf: any = {
        status: 404,
        statusMsg: "Failed",
        data: "",
        message: "Record not found",
    };

    // current response
    private resData: any = null;

    public success(): any {
        this.resData = this.s;
        return this; // for chaining
    }

    public error(): any {
        this.resData = this.e;
        return this; // for chaining
    }

    public notfound(): any {
        this.resData = this.nf;
        return this; // for chaining
    }
    
    // set key and value in response
    public set(key: string, value: any): any {
        this.resData[key] = value;
        return this;
    }
    // get response
    public get(key: string): any {
        return this.resData[key] ? this.resData[key] : false;
    }

    public send(res: any = null): any {
        if (!res) {
            res = response;
        }
        res.status(this.resData.status).set(this.resHeader).json(this.resData);
    }
}

export default StandardResponse;
