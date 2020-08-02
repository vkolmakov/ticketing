import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Order } from "../../../models/order";
import {
	OrderCreatedEvent,
	OrderStatus,
	OrderCancelledEvent,
} from "@tickets-vk/common";
import { Message } from "node-nats-streaming";
import mongoose from "mongoose";

const setup = async () => {
	const listener = new OrderCancelledListener(natsWrapper.client);

	const order = Order.build({
		id: mongoose.Types.ObjectId().toHexString(),
		status: OrderStatus.Created,
		price: 10,
		userId: "asd",
		version: 0,
	});
	await order.save();

	const data: OrderCancelledEvent["data"] = {
		id: order.id,
		version: 1,
		ticket: {
			id: "asd",
		},
	};

	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};

	return { listener, data, msg, order };
};

it("marks order as cancelled and acks the message", async () => {
	const { listener, data, msg, order } = await setup();

	await listener.onMessage(data, msg);

	const updatedOrder = await Order.findById(order.id);
	expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);

	expect(msg.ack).toHaveBeenCalled();
});
