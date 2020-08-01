import { Listener, OrderCreatedEvent, Subjects } from "@tickets-vk/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
	subject: Subjects.OrderCreated = Subjects.OrderCreated;
	queueGroupName = queueGroupName;

	async onMessage(data: OrderCreatedEvent["data"], message: Message) {
		const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
		console.log("waiting ms to expire a job", delay);

		await expirationQueue.add(
			{ orderId: data.id },
			{
				delay,
			}
		);

		message.ack();
	}
}
