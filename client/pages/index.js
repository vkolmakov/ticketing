import axios from "axios";

const LandingPage = ({ currentUser }) => {
	console.log("In the component", currentUser);
	return <h1>Landing page</h1>;
};

// May execute either on the server or on the client
// -> if executed on the server (initial loads) - make sure to explicitly specify the URL
//    for the request to go to the ingress service because it executes
//    from the context of the client service which is running in a container.
// -> if executes on the client (SPA navigation) - the request can go to /, because in this
//    case the host is already pointing to the ingress service
LandingPage.getInitialProps = async ({ req }) => {
	if (typeof window === "undefined") {
		// We are on the server
		// Ingress-nginx lives in a different k8s namespace. To make a cross-namespace k8s request
		// the URL format is http://{service-name}.{namespace-name}.svc.cluster.local
		const ingressUrl =
			"http://ingress-nginx-controller.ingress-nginx.svc.cluster.local";

		const headers = req.headers; // req object will contain the headers that we passed through with the original request
		const response = await axios.get(
			`${ingressUrl}/api/users/currentuser`,
			{
				headers: headers, // the most important headers are Host (routing) and Cookies (authentication)
			}
		);
		return response.data;
	} else {
		// We are on the client
		// requests can be made to the base URL of ''
		const response = await axios.get(`/api/users/currentuser`);
		return response.data;
	}
};

export default LandingPage;
