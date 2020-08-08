import {
	Listener,
	PaymentCreatedEvent,
	Subjects,
	OrderStatus,
} from "@tickets-vk/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
	subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
	queueGroupName = queueGroupName;
	async onMessage(data: PaymentCreatedEvent["data"], message: Message) {
		const order = await Order.findById(data.orderId);
		if (!order) {
			throw new Error("Order nof found");
		}

		order.set({
			status: OrderStatus.Complete,
		});
		await order.save();

		message.ack();
	}
}
