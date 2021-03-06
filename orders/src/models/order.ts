import mongoose from "mongoose";
import { OrderStatus } from "@tickets-vk/common";
import { TicketDoc } from "./ticket";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface OrderAtts {
	userId: string;
	status: OrderStatus;
	expiresAt: Date;
	ticket: TicketDoc;
}

interface OrderDoc extends mongoose.Document {
	userId: string;
	version: number;
	status: OrderStatus;
	expiresAt: Date;
	ticket: TicketDoc;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
	build(attrs: OrderAtts): OrderDoc;
}

const orderSchema = new mongoose.Schema(
	{
		userId: { type: String, required: true },
		status: {
			type: String,
			required: true,
			enum: Object.values(OrderStatus),
		},
		expiresAt: { type: mongoose.Schema.Types.Date },
		ticket: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket" },
	},
	{
		toJSON: {
			transform(_doc, ret) {
				ret.id = ret._id;
				delete ret._id;
			},
		},
	}
);

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAtts) => {
	return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
