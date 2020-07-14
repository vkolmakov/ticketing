import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

console.clear();

// stan is just a name used to describe client in the nats documentation language
const stan = nats.connect("ticketing", "abc", {
	url: "http://localhost:4222",
});

stan.on("connect", async () => {
	console.log("Publisher connected to NATS");

	const publisher = new TicketCreatedPublisher(stan);
	await publisher.publish({
		id: "123",
		title: "concert",
		price: 20,
		userId: "abc",
	});
});
