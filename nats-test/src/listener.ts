import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";

console.clear();

const listenerId = randomBytes(4).toString("hex");
const stan = nats.connect("ticketing", listenerId, {
	url: "http://localhost:4222",
});

stan.on("connect", () => {
	console.log("Listener connected to NATS");

	stan.on("close", () => {
		console.log("NATS connection closed!");
		process.exit();
	});

	const options = stan.subscriptionOptions().setManualAckMode(true);

	const subscription = stan.subscribe(
		"ticket:created",
		"orders-service-queue-group",
		options
	);

	subscription.on("message", (msg: Message) => {
		// Every message has a Sequence and Data
		// Sequence is the message ID on the given topic
		// Data is the actual data of the message
		const data = msg.getData();

		if (typeof data === "string") {
			const dataObject = JSON.parse(data);
			console.log(
				`Received event #${msg.getSequence()}, with data: ${dataObject}`
			);
		}

		msg.ack();
	});
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
