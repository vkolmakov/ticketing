import { TicketCreatedEvent, Listener, Subjects } from "@tickets-vk/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
	subject: Subjects.TicketCreated = Subjects.TicketCreated;
	queueGroupName = queueGroupName;

	async onMessage(data: TicketCreatedEvent["data"], message: Message) {
		const ticket = Ticket.build({
			id: data.id,
			title: data.title,
			price: data.price,
		});

		await ticket.save();

		message.ack();
	}
}
