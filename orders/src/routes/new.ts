import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import {
	requireAuth,
	validateRequest,
	NotFoundError,
	OrderStatus,
	BadRequestError,
} from "@tickets-vk/common";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";

const router = express.Router();

router.post(
	"/api/orders",
	requireAuth,
	[
		body("ticketId")
			.not()
			.isEmpty()
			.custom((input: string) => mongoose.Types.ObjectId.isValid(input)) // optional, and probably harmful for a real app. With that check, we create a subtle coupling with the tickets service's implementation detail of using MongoDB
			.withMessage("Ticket ID must be provided"),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { ticketId } = req.body;

		// Find the ticket the user is trying to order
		const ticket = await Ticket.findById(ticketId);

		if (!ticket) {
			throw new NotFoundError();
		}

		// Make sure that this ticket is not already reserved
		// Run query to look at all orders. Find an order where the ticket
		// is the ticket we just found *and* the orders status is *not* cancelled.
		// If we find an order from that the ticket *is* reserved
		const existingOrder = await Order.findOne({
			ticket: ticket,
			status: {
				$in: [
					OrderStatus.Created,
					OrderStatus.AwaitingPayment,
					OrderStatus.Complete,
				],
			},
		});

		if (existingOrder) {
			throw new BadRequestError("Ticket is already reserved");
		}

		// Calculate an expiration date for the order

		// Build the order and save it to the database

		// Publish an event saying that an order was created

		res.send({});
	}
);

export { router as newOrderRouter };
