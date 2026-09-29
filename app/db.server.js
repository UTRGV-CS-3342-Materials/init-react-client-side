// .server.js is a promise the bundler enforces: nothing in this file is sent to the browser

import Database from 'better-sqlite3';

const db = new Database('shopping.sqlite');

export function getItems() {
	return db.prepare('SELECT * FROM item').all();
}

export function getItem(itemId) {
	return db.prepare('SELECT * FROM item WHERE id = ?').get(itemId);
}

export function getReviews(itemId) {
	return db.prepare('SELECT * FROM review WHERE item_id = ?').all(itemId);
}

// returns the saved row so the API can hand the real id back to the client
export function addReview(itemId, author, content) {
	const { lastInsertRowid } = db
		.prepare('INSERT INTO review (item_id, author, content) VALUES (?, ?, ?)')
		.run(itemId, author, content);
	return { id: lastInsertRowid, item_id: itemId, author, content };
}
