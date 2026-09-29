import { data, isRouteErrorResponse, Link } from 'react-router';
import { getItem, getReviews, addReview } from '../db.server.js';
import { ItemView } from '../ItemView.jsx';

// specially named function action is run on a POST back to this route
export async function action({ request, params }) {
	const itemId = parseInt(params.item_id);
	// same check as the loader: don't save a review for an item that isn't there
	if (!getItem(itemId)) throw data('No such item.', { status: 404 });

	const formData = await request.formData();
	const author = formData.get('author');
	const content = formData.get('content');

	const errors = [];
	if (!author?.trim()) errors.push('Name is required.');
	if (!content?.trim()) errors.push('Review is required.');

	if (errors.length > 0) {
		return { errors, author, content };
	}

	addReview(itemId, author, content);

	// no redirect here: react-router reruns loader and render after an action on the same URL
	return null;
}

export function loader({ params }) {
	const itemId = parseInt(params.item_id);
	const item = getItem(itemId);

	// a bad id is an expected failure, so deal with it here where the data comes in.
	// throwing skips the component below entirely -- ItemView can count on having an item
	if (!item) throw data('No such item.', { status: 404 });

	return { item, reviews: getReviews(itemId) };
}

export default function ItemViewRoute({ loaderData, actionData }) {
	return <ItemView {...loaderData} {...actionData} />;
}

// specially named export ErrorBoundary renders in place of the route component when its
// loader/action throws, or its render crashes (root Layout still wraps it)
export function ErrorBoundary({ error }) {
	// a thrown Response/data(): an expected failure we chose to report
	if (isRouteErrorResponse(error)) {
		return (
			<p>
				{error.status}: {error.data} (<Link to="/items">back</Link>)
			</p>
		);
	}
	// anything else is a bug
	return <p>Something went wrong.</p>;
}
