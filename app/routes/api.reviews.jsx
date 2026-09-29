import { getItem, addReview } from '../db.server.js';

// JSON API used by the client-side fetch() in ItemView, so a review can be added
// without a page reload. No default export: a resource route, so the action's
// Response goes out as-is instead of rendering a page.
export async function action({ request, params }) {
	const itemId = parseInt(params.item_id);
	if (!getItem(itemId)) {
		return Response.json({ errors: ['No such item.'] }, { status: 404 });
	}

	const { author, content } = await request.json();

	// same rules as the form action -- never trust the client's checks
	const errors = [];
	if (!author?.trim()) errors.push('Name is required.');
	if (!content?.trim()) errors.push('Review is required.');

	if (errors.length > 0) {
		return Response.json({ errors }, { status: 422 });
	}

	const review = addReview(itemId, author.trim(), content.trim());
	return Response.json({ review }, { status: 201 });
}
