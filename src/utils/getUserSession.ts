import { User } from "@prisma/client";
import { Response } from "express";
import { GraphQLError } from "graphql";
import Session from "supertokens-node/recipe/session";
import { prisma } from "../database/prismaClient";
import { AppRequest } from "../types/context";
import isDev from "./isDev";

const getUserId = async (req: AppRequest, res: Response): Promise<string> => {
    if (isDev() && req.headers["x-user-id"]) {
        return req.headers["x-user-id"].toString();
    }

    const session = await Session.getSession(req, res);
    const userId = session.getUserId();
    return userId;
};

// TODO move this to graphql middleware?
export const getUserSession = async (req: AppRequest, res: Response): Promise<User> => {
    try {
        const userId = await getUserId(req, res);
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
            const createdUser = await prisma.user.create({ data: { id: userId } });
            if (!createdUser) {
                throw new GraphQLError("Unexpected Error", {
                    extensions: {
                        code: "UNEXPECTED_ERROR",
                        http: { status: 500 },
                    },
                });
            }
            return createdUser;
        }
        return user;
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
