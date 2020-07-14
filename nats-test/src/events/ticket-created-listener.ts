import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketCreatedEvent } from "@tickets-vk/common";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
	subject: Subjects.TicketCreated = Subjects.TicketCreated;
	queueGroupName = "payments-service";

	onMessage(data: TicketCreatedEvent["data"], message: Message): void {
		console.log("Event data!", data);

		message.ack();
	}
}
