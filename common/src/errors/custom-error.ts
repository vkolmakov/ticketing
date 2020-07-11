// NOTE: using an abstract class because typescript will allow us to actually
// use instanceof on this. This does not work with interfaces.
export abstract class CustomError extends Error {
	abstract statusCode: number;

	constructor(message: string) {
		super(message);
		Object.setPrototypeOf(this, CustomError.prototype);
	}

	abstract serializeErrors(): { message: string; field?: string }[];
}
