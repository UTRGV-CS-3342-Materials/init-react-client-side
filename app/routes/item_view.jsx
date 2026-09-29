import { getItem, getReviews, addReview } from '../db.server.js';
import { ItemView } from '../ItemView.jsx';

// specially named function action is run on a POST back to this route
export async function action({ request, params }) {
	const itemId = parseInt(params.item_id);
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
	return { item: getItem(itemId), reviews: getReviews(itemId) };
}

export default function ItemViewRoute({ loaderData, actionData }) {
	return <ItemView {...loaderData} {...actionData} />;
}
