import { Request, Response } from "express";

export interface Context {
    user_id: string;
}

export type AppRequest = Request & {
    context: Context;
};

export interface AppContext {
    req: AppRequest;
    res: Response;
}

declare global {
    namespace Express {
        interface Request {
            context: Context;
        }
    }
}
