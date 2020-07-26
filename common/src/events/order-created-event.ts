import { Subjects } from "./subjects";
import { OrderStatus } from "./types/order-status";

export interface OrderCreatedEvent {
	subject: Subjects.OrderCreated;
	data: {
		id: string;
		version: number;
		status: OrderStatus;
		userId: string;
		expiresAt: string; // will be converted to JSON, marking as a string
		ticket: {
			id: string;
			price: number;
		};
	};
}
