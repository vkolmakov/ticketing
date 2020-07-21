import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import { requireAuth, validateRequest } from "@tickets-vk/common";

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
		res.send({});
	}
);

export { router as newOrderRouter };
