// Chrome DevTools asks for this whenever it's open; answer so no error gets logged.
// No default export makes this a resource route: the loader's Response goes out as-is.
export function loader() {
	return new Response(null, { status: 404 });
}
