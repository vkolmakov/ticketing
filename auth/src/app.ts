import express from "express";
import "express-async-errors"; // allows error handling inside async functions without having to rely on the `next` callback
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler } from "./middlewares/error-handler";

import NotFoundError from "./errors/not-found-error";

const app = express();
app.set("trust proxy", true); // since we proxy the traffic through nginx ingress we need to tell express to allow that
app.use(json());
app.use(
	cookieSession({
		signed: false, // don't encrypt the cookie itself
		secure: process.env.NODE_ENV !== "test", // only allow on https unless testing
	})
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// 404s
app.use("*", () => {
	throw new NotFoundError();
});

app.use(errorHandler);
export { app };
