import { useState } from "react";
import axios from "axios";

export default () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState([]);

	const onSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await axios.post("/api/users/signup", {
				email,
				password,
			});

			console.log(response.data);
		} catch (err) {
			setErrors(err.response.data.errors);
		}
	};

	return (
		<form>
			<h1>Sign up</h1>
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

			{errors.length > 0 && (
				<div className="alert alert-danger">
					<h4>Oooops...</h4>
					<ul className="my-0">
						{errors.map((err) => (
							<li key={err.message}>{err.message}</li>
						))}
					</ul>
				</div>
			)}

			<button onClick={onSubmit} className="btn btn-primary">
				Sign up
			</button>
		</form>
	);
};
