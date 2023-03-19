import { Request, Response } from 'express'

export interface Context {
    user_id: string;
}

type AppRequest = Request<{ user_id: string }> & {
    context: Context;
}

export interface AppContext {
    req: AppRequest,
    res: Response
}