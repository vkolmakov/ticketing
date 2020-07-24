import { OrderCancelledEvent, Publisher, Subjects } from "@tickets-vk/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
	subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
