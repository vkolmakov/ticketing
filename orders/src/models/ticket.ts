import mongoose from "mongoose";

interface TicketAtts {
	title: string;
	price: number;
}

export interface TicketDoc extends mongoose.Document {
	title: string;
	price: number;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
	build(attrs: TicketAtts): TicketDoc;
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

ticketSchema.statics.build = (attrs: TicketAtts) => {
	return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
