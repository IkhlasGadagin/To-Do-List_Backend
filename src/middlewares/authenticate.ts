// import { Request, Response, NextFunction } from "express";
// import createHttpError from "http-errors";
// import { config } from "../config/config";
// import {verify} from "jsonwebtoken";

// export interface AuthRequest extends Request{
//     userIdi: string;
// }
// const authenticate = async (req: Request, res: Response, next: NextFunction) => {
//     console.log("the INSIDE headers");
    
//     const token = req.headers.authorization;
//     if (!token) {
//         return next(createHttpError(401, "Unauthorized"));
//     }
//     const tokenString = token.split(" ")[1];
//     const decoded = verify(tokenString, config.jwtSecrete as string);
//     console.log("DECODED",decoded, "the decoded token");

//     if(!decoded) {
//         return next(createHttpError(401, "The Token is not valid"));
//     }
//     // req.user = decoded;
//     //added the userId to the request object as string
//     const _req = req as AuthRequest;
//     _req.userIdi =decoded.userId as string;
//     next();
// }

// export default authenticate;

import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { config } from "../config/config";
import { verify } from "jsonwebtoken";

export interface AuthRequest extends Request {
  userIdi?: string;
}

// Define the expected payload structure
interface JwtPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
//   console.log("Inside authenticate middleware. Headers:", req.headers);

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(createHttpError(401, "Unauthorized: No token provided"));
  }


  try {
    const parsedToken = authHeader.split(" ")[1];

    const decoded = verify(parsedToken, config.jwtSecrete as string) as JwtPayload;

    if (!decoded || !decoded.userId) {
      return next(createHttpError(401, "Invalid token payload"));
    }

    // Attach userId to the request
    (req as AuthRequest).userIdi = decoded.userId;

    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    return next(createHttpError(401, "Invalid or expired token"));
  }
};

export default authenticate;
