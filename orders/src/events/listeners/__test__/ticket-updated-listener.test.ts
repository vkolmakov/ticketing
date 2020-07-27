import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedEvent } from "@tickets-vk/common";
import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { TicketUpdatedListener } from "../ticket-updated-listener";

const setup = async () => {
	// create an instance of the listener
	const listener = new TicketUpdatedListener(natsWrapper.client);

	// create and save a ticket
	const ticket = Ticket.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		title: "concert",
		price: 25,
	});
	await ticket.save();

	// create a fake data event and message object
	const data: TicketUpdatedEvent["data"] = {
		version: ticket.version + 1,
		id: ticket.id,
		title: "new concert",
		price: 999,
		userId: new mongoose.Types.ObjectId().toHexString(),
	};

	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};

	return { listener, data, msg, ticket };
};

it("finds, updates and saves a ticket", async () => {
	const { listener, data, msg, ticket } = await setup();

	await listener.onMessage(data, msg);

	const updatedTicket = await Ticket.findById(ticket.id);

	expect(updatedTicket!.title).toEqual(data.title);
	expect(updatedTicket!.price).toEqual(data.price);
	expect(updatedTicket!.version).toEqual(data.version);
});

it("acks the message", async () => {
	const { listener, data, msg } = await setup();

	await listener.onMessage(data, msg);

	expect(msg.ack).toHaveBeenCalled();
});

it("does not process an event if version is out of order", async () => {
	const { listener, data, msg } = await setup();

	data.version = 10;

	try {
		await listener.onMessage(data, msg);
	} catch (err) {}

	expect(msg.ack).not.toHaveBeenCalled();
});
