import { Publisher, TicketCreatedEvent, Subjects } from "@tickets-vk/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
	subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
