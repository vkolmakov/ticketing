import express, { Request, Response } from "express";
import {
	requireAuth,
	validateRequest,
	NotFoundError,
	NotAuthorizedError,
	OrderStatus,
	BadRequestError,
} from "@tickets-vk/common";
import { body } from "express-validator";
import { Order } from "../models/order";
import { stripe } from "../stripe";

const router = express.Router();

router.post(
	"/api/payments",
	requireAuth,
	[body("token").not().isEmpty(), body("orderId").not().isEmpty()],
	validateRequest,
	async (req: Request, res: Response) => {
		const { token, orderId } = req.body;

		const order = await Order.findById(orderId);

		if (!order) {
			throw new NotFoundError();
		}
		if (order.userId !== req.currentUser!.id) {
			throw new NotAuthorizedError();
		}
		if (order.status === OrderStatus.Cancelled) {
			throw new BadRequestError("Cannot pay for a cancelled order");
		}

		await stripe.charges.create({
			currency: "usd",
			amount: order.price * 100, // convert to cents
			source: token,
		});

		res.status(201).send({ success: true });
	}
);

export { router as createChangeRouter };
