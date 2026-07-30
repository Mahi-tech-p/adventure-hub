import jwt, {  Secret, SignOptions } from "jsonwebtoken"
import { env } from "../../config/env.js"

interface JwtPayload {
    userId: string,
    email: string
}

export const generateAccessToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, env.accessTokenSecret as Secret, {
        expiresIn: env.accessTokenExpiresIn as SignOptions["expiresIn"]
    })
}

export const generateRefreshToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, env.refreshTokenSecret as Secret, {
        expiresIn : env.refreshTokenExpiresIn as SignOptions["expiresIn"]
    })
}

export const verifyAccessToken = (token:string):JwtPayload => {
    return jwt.verify(token,env.accessTokenSecret as Secret) as JwtPayload
}

export const verifyRefreshToken = (token:string):JwtPayload => {
    return jwt.verify(token,env.refreshTokenSecret as Secret) as JwtPayload
}