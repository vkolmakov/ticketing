import nats from "node-nats-streaming";

console.clear();

// stan is just a name used to describe client in the nats documentation language
const stan = nats.connect("ticketing", "abc", {
	url: "http://localhost:4222",
});

stan.on("connect", () => {
	console.log("Publisher connected to NATS");

	const data = {
		id: "123",
		title: "concert",
		price: 20,
	};

	// NATS only allows sending strings - so we have to serialize it
	const dataJsonString = JSON.stringify(data);

	stan.publish("ticket:created", dataJsonString, () => {
		console.log("Event published");
	});
});
