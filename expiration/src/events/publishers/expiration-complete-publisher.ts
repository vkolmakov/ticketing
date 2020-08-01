import {
	Publisher,
	ExpirationCompleteEvent,
	Subjects,
} from "@tickets-vk/common";

export class ExpirationCompletePublisher extends Publisher<
	ExpirationCompleteEvent
> {
	subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
