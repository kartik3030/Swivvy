import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface JwtPayload {
    id: string;
    email: string;
}

interface AuthRequest extends Request {
    user: JwtPayload;
}

const requireAuth = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    const token = req.cookies?.token;

    if (!token) {
        res.status(401).json({
            error: "Unauthorized",
        });
        return;
    }

    if (!process.env.JWT_SECRET) {
        res.status(500).json({
            error: "JWT_SECRET missing",
        });
        return;
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        ) as JwtPayload;

        req.user = decoded;

        next();

    } catch (error) {
        res.status(401).json({
            error: "Invalid token",
        });
    }
};

export default requireAuth;