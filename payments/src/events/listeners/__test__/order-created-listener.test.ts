import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Order } from "../../../models/order";
import { OrderCreatedEvent, OrderStatus } from "@tickets-vk/common";
import { Message } from "node-nats-streaming";
import mongoose from "mongoose";

const setup = async () => {
	const listener = new OrderCreatedListener(natsWrapper.client);

	const data: OrderCreatedEvent["data"] = {
		id: mongoose.Types.ObjectId().toHexString(),
		version: 0,
		expiresAt: "asd",
		userId: "asd",
		status: OrderStatus.Created,
		ticket: {
			id: "asd",
			price: 10,
		},
	};

	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};

	return { listener, data, msg };
};

it("replicates order info and acks the message", async () => {
	const { listener, data, msg } = await setup();

	await listener.onMessage(data, msg);

	const order = await Order.findById(data.id);

	expect(order!.price).toEqual(data.ticket.price);

	expect(msg.ack).toHaveBeenCalled();
});
