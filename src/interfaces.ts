export interface PromiseInterface{
    status: number;
    message: string;
    errorClassObj?: Error;
    code?: string;
    data?: any;
}
