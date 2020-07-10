import { useState } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";

export default () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { doRequest, errors } = useRequest({
		url: "/api/users/signin",
		method: "post",
		body: { email, password },
		onSuccess: () => Router.push("/"),
	});

	const onSubmit = async (e) => {
		e.preventDefault();

		await doRequest();
	};

	return (
		<form>
			<h1>Sign in</h1>
			<div className="form-group">
				<label>
					Email Address
					<input
						value={email}
						className="form-control"
						onChange={(e) => setEmail(e.target.value)}
					></input>
				</label>
			</div>

			<div className="form-group">
				<label>
					Password
					<input
						onChange={(e) => setPassword(e.target.value)}
						value={password}
						type="password"
						className="form-control"
					></input>
				</label>
			</div>

			{errors}

			<button onClick={onSubmit} className="btn btn-primary">
				Sign in
			</button>
		</form>
	);
};
