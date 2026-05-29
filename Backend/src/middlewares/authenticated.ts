import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface JwtPayload {
    id: string;
    email: string;
    exp: number;
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

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as JwtPayload;

        const now = Math.floor(Date.now() / 1000);

        const remainingSeconds =
            decoded.exp - now;

        // Refresh if less than 12 hours remain
        if (remainingSeconds < 12 * 60 * 60) {
            const newToken = jwt.sign(
                {
                    id: decoded.id,
                    email: decoded.email,
                },
                process.env.JWT_SECRET!,
                {
                    expiresIn: "1d",
                }
            );

            res.cookie("token", newToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 24 * 60 * 60 * 1000,
            });
        }

        req.user = decoded;

        next();
    } catch {
        res.status(401).json({
            error: "Invalid token",
        });
    }
};

export default requireAuth;