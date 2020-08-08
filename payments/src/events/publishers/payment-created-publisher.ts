import { Publisher, PaymentCreatedEvent, Subjects } from "@tickets-vk/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
	subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
