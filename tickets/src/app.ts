import express from "express";
import "express-async-errors"; // allows error handling inside async functions without having to rely on the `next` callback
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError } from "@tickets-vk/common";
import { createTicketRouter } from "./routes/new";

const app = express();
app.set("trust proxy", true); // since we proxy the traffic through nginx ingress we need to tell express to allow that
app.use(json());
app.use(
	cookieSession({
		signed: false, // don't encrypt the cookie itself
		secure: process.env.NODE_ENV !== "test", // only allow on https unless testing
	})
);

app.use(createTicketRouter);

// 404s
app.use("*", () => {
	throw new NotFoundError();
});

app.use(errorHandler);
export { app };
