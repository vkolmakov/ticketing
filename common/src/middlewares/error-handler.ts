import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/custom-error";

function singleError(message: string) {
	return {
		errors: [{ message: message, field: void 0 }],
	};
}

export function errorHandler(
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (err instanceof CustomError) {
		return res
			.status(err.statusCode)
			.send({ errors: err.serializeErrors() });
	}

	res.status(500).send(singleError(err.message));
}
