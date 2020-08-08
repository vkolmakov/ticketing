import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order } from "../../models/order";
import { OrderStatus } from "@tickets-vk/common";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";

it("returns a 404 when purchasing an order that does not exist", async () => {
	await request(app)
		.post("/api/payments")
		.set("Cookie", global.signin())
		.send({
			token: "asdf",
			orderId: mongoose.Types.ObjectId().toHexString(),
		})
		.expect(404);
});

it("returns a 401 when purchasing an order that does not belong to the user", async () => {
	const order = Order.build({
		id: mongoose.Types.ObjectId().toHexString(),
		userId: mongoose.Types.ObjectId().toHexString(),
		version: 0,
		price: 100,
		status: OrderStatus.Created,
	});
	await order.save();

	await request(app)
		.post("/api/payments")
		.set("Cookie", global.signin())
		.send({
			token: "asdf",
			orderId: order.id,
		})
		.expect(401);
});

it("returns a 400 when purchasing a cancelled order", async () => {
	const userId = mongoose.Types.ObjectId().toHexString();
	const order = Order.build({
		id: mongoose.Types.ObjectId().toHexString(),
		userId: userId,
		version: 0,
		price: 100,
		status: OrderStatus.Cancelled,
	});
	await order.save();

	await request(app)
		.post("/api/payments")
		.set("Cookie", global.signin(userId))
		.send({
			token: "asdf",
			orderId: order.id,
		})
		.expect(400);
});

it("returns a 201 with valid inputs", async () => {
	const userId = mongoose.Types.ObjectId().toHexString();
	const price = Math.floor(Math.random() * 1000); // random price will be used to id the charge
	const order = Order.build({
		id: mongoose.Types.ObjectId().toHexString(),
		userId: userId,
		version: 0,
		price: price,
		status: OrderStatus.Created,
	});
	await order.save();

	await request(app)
		.post("/api/payments")
		.set("Cookie", global.signin(userId))
		.send({
			token: "tok_visa",
			orderId: order.id,
		})
		.expect(201);

	const stripeCharges = await stripe.charges.list({
		limit: 50,
	});
	const charge = stripeCharges.data.find((c) => c.amount === price * 100);

	expect(charge).toBeDefined();
	expect(charge!.currency).toEqual("usd");

	const payment = Payment.findOne({
		orderId: order.id,
		stripeId: charge!.id,
	});
	expect(payment).not.toBeNull();
});
