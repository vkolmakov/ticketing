import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";
import Header from "../components/header";

const AppComponent = ({ Component, pageProps, currentUser }) => {
	return (
		<div>
			<Header currentUser={currentUser}></Header>
			<Component currentUser={currentUser} {...pageProps}></Component>
		</div>
	);
};

// In NextJS, custom app component supplies a different set of
// parameters - the context will be in the `ctx` property
AppComponent.getInitialProps = async (appContext) => {
	const client = buildClient(appContext.ctx);
	const { data } = await client.get("/api/users/currentuser"); // required for the top-level app

	let pageProps = {};
	if (appContext.Component.getInitialProps) {
		pageProps = await appContext.Component.getInitialProps(appContext.ctx); // required to get intial props for the inividual page, otherwise it won't run
	}

	return {
		pageProps,
		currentUser: data.currentUser,
	};
};

export default AppComponent;
