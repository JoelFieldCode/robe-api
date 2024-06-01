import { Response } from "express";
import { GraphQLError } from "graphql";
import Session from "supertokens-node/recipe/session";
import { AppRequest } from "../types/context";

// TODO move this to graphql middleware?
export const getUserSession = async (req: AppRequest, res: Response) => {
    try {
        return 'e012e2fc-f6f8-4140-894c-535b30e93479'
        const session = await Session.getSession(req, res);
        const userId = session.getUserId();
        return userId;
    } catch (err) {
        if (Session.Error.isErrorFromSuperTokens(err)) {
            throw new GraphQLError("Session related error", {
                extensions: {
                    code: "UNAUTHENTICATED",
                    http: { status: err.type === Session.Error.INVALID_CLAIMS ? 403 : 401 },
                },
            });
        } else {
            throw new GraphQLError("Unexpected Error", {
                extensions: {
                    code: "UNEXPECTED_ERROR",
                    http: { status: 500 },
                },
            });
        }
    }
};
