//  authentification
import { Request, Response, NextFunction } from "express";
import { HttpCode } from "../core/constants";
import token from "../token/token";
import { error } from 'console';

interface user {
    utilisateur_id: string;
    email: string;
    name: string;
    motDePasse: string
}

interface userRequest extends Request {
    user?: user;
}

const authAccess= {
    
 
 decodeRefreshToken: async(req: userRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.refreshToken
    if(!token) {
        console.log("no refresh token provided");
        return res.status(HttpCode.BAD_REQUEST).json({msg: "no refresh token provided"})
    }
    try {
        const decodedUser = await token.verifyAccessrefreshToken(token)
        if (!decodedUser){
             return res.status(HttpCode.FORBIDDEN).json({
          message: "Forbidden: Invalid refresh token"
             })
        }
        req.user = decodedUser
        next(error)
    } catch (error) {
        console.error("error decoding refresh token", error)
    }

 },

 decodeAccessToken: async (req: userRequest, res: Response, next: NextFunction ) => {
   const Token = req.headers.authorization

   const refreshtoken = req.cookies.refreshToken;
   if (!Token && !refreshtoken) {
     console.log("No access token provided");
     return res.status(HttpCode.UNAUTHORIZED).json({
       message: "Unauthorized: No access token provided"
     });
   }

   try {
     const decodedUser = await token.verifyAccessToken(Token || "");
    
     if (!decodedUser) {
       return res.status(HttpCode.FORBIDDEN).json({
         message: "Forbidden: Invalid access token"
       });
     }
     req.user = decodedUser;
     next();
     return;
   } catch (error) {
     console.error("Error decoding access token:", error);
     return res.status(HttpCode.FORBIDDEN).json({msg: "Forbidden: Error decoding access token"
     });
   }
 
}
}

export default authAccess