import { useState } from 'react';
import { Link } from 'react-router';

function Review({ review }) {
	return (
		<div className="card w-100 mt-3">
			<div className="card-header">
				<em>{review.author}</em>
			</div>
			<div className="card-body">
				<p>{review.content}</p>
			</div>
		</div>
	);
}

export function ItemView({ item, reviews, errors, author, content }) {
	const failed = errors?.length > 0;
	const [blank, setBlank] = useState({
		author: failed && !author?.trim(),
		content: failed && !content?.trim(),
	});

	function checkBlank(event) {
		const { name, value } = event.target;
		setBlank({ ...blank, [name]: value.trim() === '' });
	}

	// the list lives in client state now, so a new review can be added without a reload
	const [list, setList] = useState(reviews);

	async function submitReview(event) {
		event.preventDefault();
		const form = event.currentTarget;
		const author = form.elements.author.value;
		const content = form.elements.content.value;

		// post as JSON and wait for the saved review to come back
		const response = await fetch(`/api/item_view/${item.id}/reviews`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ author, content }),
		});

		// no error handling yet
		if (!response.ok) return;
		const { review } = await response.json();

		// new state -> React re-renders the list with the review at the top
		setList([review, ...list]);
		form.reset();
	}

	const messages = [];
	if (blank.author) messages.push('Name is required.');
	if (blank.content) messages.push('Review is required.');

	return (
		<>
			<div className="pb-2 mt-4 mb-2 border-bottom">
				<h1>{item.name}</h1>
				<p>
					(<Link to="/items">back</Link>)
				</p>
			</div>

			<div className="row">
				<div className="col-4">
					<img className="img-fluid" src={item.image_url} />
				</div>
				<div className="col-4">
					<div>{item.description}</div>
					<div>
						<em>${item.cost}</em>
					</div>
				</div>
			</div>

			<div className="row my-4">
				<div className="col-8">
					<h3>Reviews</h3>
	
					<div className="card w-100 mt-3">
						<div className="card-body">
							{/* onSubmit only runs once the page is hydrated; before that (or with JS off)
							    the plain POST to the route action still works */}
							<form method="POST" onSubmit={submitReview}>
								{messages.length > 0 && (
									<div className="alert alert-danger">
										<ul className="mb-0">
											{messages.map((message) => (
												<li key={message}>{message}</li>
											))}
										</ul>
									</div>
								)}
								<div className="form-group">
									<label>Add your review!</label>
									{/* defaultValue for unmanaged component */}
									<input
										className="form-control mb-1"
										placeholder="Name"
										name="author"
										defaultValue={author}
										onBlur={checkBlank}
									/>
								</div>
								<div className="form-group">
									{/* react uses value for textarea (HTML uses child conent) */}
									<textarea
										className="form-control mb-1"
										placeholder="Review"
										name="content"
										defaultValue={content}
										onBlur={checkBlank}
									/>
								</div>
								<div className="form-group">
									<button type="submit" className="btn btn-primary">
										Submit
									</button>
								</div>
							</form>
						</div>
					</div>
					
					{list.map((review) => (
						<Review key={review.id} review={review} />
					))}
				</div>
			</div>
		</>
	);
}
