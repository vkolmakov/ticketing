import mongoose from "mongoose";
import { OrderStatus } from "@tickets-vk/common";
import { Order } from "./order";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketAtts {
	id: string;
	title: string;
	price: number;
}

export interface TicketDoc extends mongoose.Document {
	title: string;
	price: number;
	version: number;
	isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
	build(attrs: TicketAtts): TicketDoc;
	findByEvent(event: {
		id: string;
		version: number;
	}): Promise<TicketDoc | null>;
}

const ticketSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		price: { type: Number, required: true, min: 0 },
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

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attrs: TicketAtts) => {
	return new Ticket({
		_id: attrs.id, // make sure that mongo does not overwrite the ID and that it stays consistent across services
		title: attrs.title,
		price: attrs.price,
	});
};

ticketSchema.statics.findByEvent = (event: { id: string; version: number }) => {
	return Ticket.findOne({
		_id: event.id,
		version: event.version - 1,
	});
};

ticketSchema.methods.isReserved = async function () {
	// has to be a `function` because we need to use `this` keyword to access the value of the document
	const existingOrder = await Order.findOne({
		ticket: this,
		status: {
			$in: [
				OrderStatus.Created,
				OrderStatus.AwaitingPayment,
				OrderStatus.Complete,
			],
		},
	});

	return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
