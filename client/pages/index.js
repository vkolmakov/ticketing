import buildClient from "../api/build-client";

const LandingPage = ({ currentUser }) => {
	return currentUser ? (
		<h1>You are signed in</h1>
	) : (
		<h1>You are NOT signed in</h1>
	);
};

// May execute either on the server or on the client
// -> if executed on the server (initial loads) - make sure to explicitly specify the URL
//    for the request to go to the ingress service because it executes
//    from the context of the client service which is running in a container.
// -> if executes on the client (SPA navigation) - the request can go to /, because in this
//    case the host is already pointing to the ingress service
LandingPage.getInitialProps = async (context) => {
	const client = buildClient(context);
	const { data } = await client.get("/api/users/currentuser");

	return data;
};

export default LandingPage;
