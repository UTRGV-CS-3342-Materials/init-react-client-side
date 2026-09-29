import { index, route } from '@react-router/dev/routes';

// Routing is now data, not a sequence of app.get() calls.
// The framework reads this to build both the server router and the client one.
export default [
	index('routes/home.jsx'),
	route('items', 'routes/items.jsx'),
	route('item_view/:item_id', 'routes/item_view.jsx'),
	route('api/item_view/:item_id/reviews', 'routes/api.reviews.jsx'),
	route('.well-known/appspecific/com.chrome.devtools.json', 'routes/devtools.jsx'),
];
