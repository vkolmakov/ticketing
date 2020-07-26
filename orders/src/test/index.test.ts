import request from "supertest";
import { Ticket } from "../models/ticket";
import { app } from "../app";
import mongoose from "mongoose";

const buildTicket = async () => {
	const ticket = Ticket.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		title: "concert",
		price: 20,
	});

	await ticket.save();
	return ticket;
};

it("responds with a list of orders", async () => {
	// Create three tickets
	const ticket1 = await buildTicket();
	const ticket2 = await buildTicket();
	const ticket3 = await buildTicket();

	const user1 = global.signin();
	const user2 = global.signin();

	// Create one order as user #1
	await request(app)
		.post("/api/orders")
		.set("Cookie", user1)
		.send({ ticketId: ticket1.id })
		.expect(201);

	// Create two orders as user #2
	const { body: order2 } = await request(app)
		.post("/api/orders")
		.set("Cookie", user2)
		.send({ ticketId: ticket2.id })
		.expect(201);
	const { body: order3 } = await request(app)
		.post("/api/orders")
		.set("Cookie", user2)
		.send({ ticketId: ticket3.id })
		.expect(201);

	// Make requests for user #2
	const response1 = await request(app)
		.get("/api/orders")
		.set("Cookie", user1)
		.expect(200);
	const response2 = await request(app)
		.get("/api/orders")
		.set("Cookie", user2)
		.expect(200);

	// // Make sure we only got tickets for user #2
	expect(response2.body.length).toEqual(2);
	expect(response2.body[0].id).toEqual(order2.id);
	expect(response2.body[1].id).toEqual(order3.id);
});
