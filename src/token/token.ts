import jwt from 'jsonwebtoken';
import { envs } from '../core/config/env';
import { create } from 'domain';
import { verify } from 'crypto';
import { token, token } from 'morgan';
import { decode } from 'punycode';
import { Prisma } from '@prisma/client';



const token = {
    createToken : (payload: any) => {
        return jwt.sign(payload, envs.token_key, {expiresIn: "1h"})
    },
    verifyAccessToken : (token:string) => {
        return jwt.verify(token, envs.token_key)
    },
    decodeAccessToken : (token: string) => {
        return jwt.decode(token)
    },
    refreshtoken: (payload: any) => {
        return jwt.sign(payload, envs.token_key, {expiresIn: "30d"})
    },
    verifyAccessrefreshToken : (token:string) => {
        return jwt.verify(token, envs.token_key)
    },
    decodeAccessrefreshToken : (token: string) => {
        return jwt.decode(token)
    },
    
}

export default token
