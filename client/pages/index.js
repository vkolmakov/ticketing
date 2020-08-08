import Link from "next/link";

const LandingPage = ({ currentUser, tickets }) => {
	const Ticket = (ticket) => {
		return (
			<tr key={ticket.id}>
				<td>{ticket.title}</td>
				<td>{ticket.price}</td>
				<td>
					<Link
						href="/tickets/[ticketId]"
						as={`/tickets/${ticket.id}`}
					>
						<a className="nav-link">View</a>
					</Link>
				</td>
			</tr>
		);
	};
	const AuthStatus = () =>
		currentUser ? (
			<h1>You are signed in</h1>
		) : (
			<h1>You are NOT signed in</h1>
		);

	return (
		<div>
			<h1>Tickets</h1>
			<table className="table">
				<thead>
					<tr>
						<th>Title</th>
						<th>Price</th>
						<th>Link</th>
					</tr>
				</thead>

				<tbody>{tickets.map(Ticket)}</tbody>
			</table>
		</div>
	);
};

// May execute either on the server or on the client
// -> if executed on the server (initial loads) - make sure to explicitly specify the URL
//    for the request to go to the ingress service because it executes
//    from the context of the client service which is running in a container.
// -> if executes on the client (SPA navigation) - the request can go to /, because in this
//    case the host is already pointing to the ingress service
LandingPage.getInitialProps = async (context, client, currentUser) => {
	const tickets = await client.get("/api/tickets");
	return { tickets: tickets.data };
};

export default LandingPage;
