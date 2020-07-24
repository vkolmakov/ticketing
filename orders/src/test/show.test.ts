import request from "supertest";
import { Ticket } from "../models/ticket";
import { app } from "../app";

it("fetches an order", async () => {
	const user = global.signin();

	const ticket = Ticket.build({
		title: "concert",
		price: 20,
	});
	await ticket.save();

	const { body: order } = await request(app)
		.post("/api/orders")
		.set("Cookie", user)
		.send({ ticketId: ticket.id })
		.expect(201);

	const { body: fetchedOrder } = await request(app)
		.get(`/api/orders/${order.id}`)
		.set("Cookie", user)
		.send()
		.expect(200);

	expect(fetchedOrder.id).toEqual(order.id);
});

it("throws a 401 if a user tries to request a ticket they don't own", async () => {
	const user = global.signin();

	const ticket = Ticket.build({
		title: "concert",
		price: 20,
	});
	await ticket.save();

	const { body: order } = await request(app)
		.post("/api/orders")
		.set("Cookie", user)
		.send({ ticketId: ticket.id })
		.expect(201);

	await request(app)
		.get(`/api/orders/${order.id}`)
		.set("Cookie", global.signin())
		.send()
		.expect(401);
});
