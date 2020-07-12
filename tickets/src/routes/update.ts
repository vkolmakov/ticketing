import express, { Request, Response } from "express";
import { requireAuth, NotFoundError } from "@tickets-vk/common";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.put(
	"/api/tickets/:id",
	requireAuth,
	async (req: Request, res: Response) => {
		const ticket = await Ticket.findById(req.params.id);

		if (!ticket) {
			throw new NotFoundError();
		}

		res.send(ticket);
	}
);

export { router as updateTicketRouter };
