import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import request from "supertest";
import jwt from "jsonwebtoken";

declare global {
	namespace NodeJS {
		interface Global {
			signin(id?: string): string[];
		}
	}
}

// Will be mocked in all of the tests
jest.mock("../nats-wrapper");

let mongo: MongoMemoryServer;

// Outside of beforeAll for a reason - this must be set before we load any modules
process.env.STRIPE_KEY =
	"sk_test_51HDeyZHqKaKD6geKw016gpvqf5n5WbeJgb7RL75nFzj0hpgh94M2TPuh6hKtMkOMUDj4uGHErUxiTxkofk91zKjM00M4Q3GcBd";

beforeAll(async () => {
	process.env.JWT_KEY = "some-key";

	mongo = new MongoMemoryServer();
	const mongoUri = await mongo.getUri();

	await mongoose.connect(mongoUri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
});

beforeEach(async () => {
	jest.clearAllMocks();

	const collections = await mongoose.connection.db.collections();
	for (let collection of collections) {
		await collection.deleteMany({});
	}
});

afterAll(async () => {
	await mongo.stop();
	await mongoose.connection.close();
});

global.signin = (id?: string) => {
	// Build a JWT payload - { id, email }
	const payload = {
		id: id || new mongoose.Types.ObjectId().toHexString(), // ensure that any time we sign in, we sign in as a new user
		email: "test@test.com",
	};

	// Create the JWT
	const token = jwt.sign(payload, process.env.JWT_KEY!);

	// Build the session object - { jwt: MY_JWT }
	const session = { jwt: token };

	// Turn that session into JSON string
	const sessionJSON = JSON.stringify(session);

	// Take JSON and encode it as base64
	const base64 = Buffer.from(sessionJSON).toString("base64");

	// return a string thats the cookie with the encoded data
	return [`express:sess=${base64}`];
};
