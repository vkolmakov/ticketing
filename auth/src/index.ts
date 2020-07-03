import express from "express";
import "express-async-errors"; // allows error handling inside async functions without having to rely on the `next` callback
import { json } from "body-parser";
import mongoose from "mongoose";
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
		secure: true, // only allow on https
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

async function start() {
	// Better to fail as soon as possible in case we forgot to set the environment variable
	if (!process.env.JWT_KEY) {
		throw new Error("JWT_KEY must be defined");
	}

	try {
		await mongoose.connect("mongodb://auth-mongo-srv:27017/auth", {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		});
		console.log("Connected to MongoDB");
	} catch (err) {
		console.error(err);
	}

	app.listen(3000, () => {
		console.log("Listening on 3000");
	});
}

start();
