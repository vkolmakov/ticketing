import axios from "axios";

export default ({ req }) => {
	if (typeof window === "undefined") {
		// on the server
		return axios.create({
			// Ingress-nginx lives in a different k8s namespace. To make a cross-namespace k8s request
			// the URL format is http://{service-name}.{namespace-name}.svc.cluster.local
			baseURL:
				"http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
			headers: req.headers, // the most important headers are Host (routing) and Cookies (authentication)
		});
	} else {
		// on the client
		return axios.create({
			baseURL: "/",
			// no need for headers, browser will pass them on
		});
	}
};
