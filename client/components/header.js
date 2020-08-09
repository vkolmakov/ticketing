import Link from "next/link";

export default ({ currentUser }) => {
	const links = [
		!currentUser && { label: "Sign up", href: "/auth/signup" },
		!currentUser && { label: "Sign in", href: "/auth/signin" },
		currentUser && { label: "Sell Tickets", href: "/tickets/new" },
		currentUser && { label: "My Orders", href: "/orders" },
		currentUser && { label: "Sign out", href: "/auth/signout" },
	];
	return (
		<nav className="navbar navbar-light bg-light">
			<Link href="/">
				<a className="navbar-brand">GitTix</a>
			</Link>

			<div className="d-flex justify-content-end">
				<ul className="nav d-flex align-items-center">
					{links.filter(Boolean).map(({ label, href }) => {
						return (
							<li className="nav-item" key={href}>
								<Link href={href}>
									<a className="nav-link">{label}</a>
								</Link>
							</li>
						);
					})}
				</ul>
			</div>
		</nav>
	);
};
