import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface UserPayload {
	id: string;
	email: string;
}

// Augment an existing Request interface with a
// new property.
declare global {
	namespace Express {
		interface Request {
			currentUser?: UserPayload;
		}
	}
}

// Sets `currentUser` property on the request if JWT is present in the session
export function currentUser(req: Request, res: Response, next: NextFunction) {
	if (!req.session?.jwt) {
		return next();
	}

	try {
		const payload = jwt.verify(
			req.session.jwt,
			process.env.JWT_KEY!
		) as UserPayload;
		req.currentUser = payload;
	} catch (err) {
		// Token was present but not valid. We don't care about it in this case
	}
	next();
}
