import Queue from "bull";

interface Payload {
	orderId: string;
}

const expirationQueue = new Queue<Payload>("order:expiration", {
	redis: {
		host: process.env.REDIS_HOST,
	},
});

expirationQueue.process(async (job) => {
	const { orderId } = job.data;
	console.log(
		"I want to publish an expiration:complete event for orderId",
		orderId
	);
});

export { expirationQueue };
