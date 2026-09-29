import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';

const FAKE_LATENCY_MS = 500;
function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// specially named export middleware runs on the server before the loaders/actions of every route below it
// (root is above everything, so this delays every request once)
export const middleware = [
	async (_args, next) => {
		await sleep(FAKE_LATENCY_MS);
		return next();
	},
];

// every URL subdir can have a specially named Layout wrapper
export function Layout({ children }) {
	return (
		<html>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>Incredibly Simple Shopping</title>
				{/* empty inline icon so the browser doesn't request /favicon.ico (no route matches it) */}
				<link rel="icon" href="data:," />
				<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" />
				<link rel="stylesheet" href="/main.css" />
				<Meta />
				<Links />
			</head>
			<body>
				<div className="container">
					{children}
				</div>
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

// Outlet is where the dynamic content goes, automatically wrapped in Layout if it exists
export default function App() {
	return <Outlet />;
}
