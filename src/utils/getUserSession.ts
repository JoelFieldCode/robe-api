import { Response } from "express";
import { GraphQLError } from "graphql";
import Session from "supertokens-node/recipe/session";
import { AppRequest } from "../types/context";

// TODO move this to graphql middleware?
export const getUserSession = async (req: AppRequest, res: Response) => {
    try {
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
        }
    }
};
