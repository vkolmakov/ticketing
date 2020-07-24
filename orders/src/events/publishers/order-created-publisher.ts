import { Publisher, Subjects, OrderCreatedEvent } from "@tickets-vk/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
	subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
