import { getItems } from '../db.server.js';
import { Items } from '../Items.jsx';

// loader is a specially-named function that is run first and the result passed to the render function
export function loader() {
	return { items: getItems() };
}

// whatever function is default exported is considered the render function
// it is a react component, returning a react tree
export default function ItemsRoute({ loaderData }) {
	// spread syntax (...) used to pass each key/value pair as an attribute
	return <Items {...loaderData} />;
}
