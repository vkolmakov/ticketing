import express, { Request, Response } from "express";
import { requireAuth, validateRequest } from "@tickets-vk/common";
import { body } from "express-validator";

const router = express.Router();

router.post(
	"/api/payments",
	requireAuth,
	[body("token").not().isEmpty(), body("orderId").not().isEmpty()],
	validateRequest,
	async (req: Request, res: Response) => {
		res.send({ success: true });
	}
);

export { router as createChangeRouter };
