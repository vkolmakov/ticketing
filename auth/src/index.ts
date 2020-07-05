import mongoose from "mongoose";
import { app } from "./app";

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
