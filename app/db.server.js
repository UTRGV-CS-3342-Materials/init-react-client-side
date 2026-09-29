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

export function addReview(itemId, author, content) {
	db.prepare('INSERT INTO review (item_id, author, content) VALUES (?, ?, ?)').run(
		itemId,
		author,
		content,
	);
}
