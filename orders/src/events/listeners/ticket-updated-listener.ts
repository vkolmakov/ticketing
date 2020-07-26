import { Listener, TicketUpdatedEvent, Subjects } from "@tickets-vk/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
	subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
	queueGroupName = queueGroupName;
	async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
		const ticket = await Ticket.findByEvent(data);

		if (!ticket) {
			throw new Error("Ticket not found");
		}

		// Solve the issue with coupling to the version schema -
		// we just take the exact same version that was given to us
		// by the event and save it.
		const { title, price, version } = data;
		ticket.set({
			title,
			price,
			version,
		});

		await ticket.save();

		msg.ack();
	}
}
