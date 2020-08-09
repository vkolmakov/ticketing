import { useState, useEffect } from "react";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

const OrderShow = ({ order, currentUser }) => {
	const [timeLeft, setTimeLeft] = useState(0);
	const { doRequest, errors } = useRequest({
		url: "/api/payments",
		method: "post",
		body: {
			orderId: order.id,
		},
		onSuccess: () => Router.push("/orders"),
	});
	useEffect(() => {
		const findTimeLeft = () => {
			const msLeft = new Date(order.expiresAt) - new Date();
			setTimeLeft(Math.round(msLeft / 1000));
		};

		findTimeLeft();
		const timerId = setInterval(findTimeLeft, 1000);

		return () => {
			// will be called when the component is unmounted
			clearInterval(timerId);
		};
	}, []);

	if (timeLeft < 0) {
		return <div>Order expired</div>;
	}

	return (
		<div>
			Time left to pay: {timeLeft} seconds
			<StripeCheckout
				token={({ id }) => doRequest({ token: id })}
				stripeKey="pk_test_51HDeyZHqKaKD6geKFJfAKzZFd3iGVC6RIzZJxGXYVJ20vaNaB4JyzE4Q0Ed28McHiKF4F0VbOHxjNYsuPFQ6pXul00CEhgLYBR"
				amount={order.ticket.price * 100} /* to cents */
				email={currentUser.email}
			></StripeCheckout>
			{errors}
		</div>
	);
};

OrderShow.getInitialProps = async (context, client) => {
	const { orderId } = context.query;
	const { data } = await client.get(`/api/orders/${orderId}`);

	return { order: data };
};

export default OrderShow;
