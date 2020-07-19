import { Publisher, TicketUpdatedEvent, Subjects } from "@tickets-vk/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
	subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
