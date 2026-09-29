# 03 — React Router

Same two pages, same components, handed to a framework.

    npm install && npm run dev      # http://localhost:8080/items
    npm run build && npm start      # production build

`app/Items.jsx` and `app/ItemView.jsx` are copied from version 02 **unchanged**. Only the
plumbing is different.

## What the framework took over

| version 02 | here |
|---|---|
| `app.get('/items', ...)` | `app/routes.js` — routing is data |
| you called the db in the handler | `export async function loader()` — you export it, the framework calls it |
| `window.__DATA__` + `<script src>` | `<Scripts />` in `app/root.jsx` |
| esbuild, two commands you wrote | Vite, configured by the framework plugin |
| every click is a full page load | client router fetches only the loader data |

## The new idea: a boundary the tooling enforces

`app/db.server.js` never reaches the browser — the `.server.js` suffix makes the bundler
guarantee it. Import it from `Items.jsx` and the build fails. In versions 01 and 02
nothing stopped you from importing the database into a component; it just happened not to
be bundled. Here it is checked.

## JS to notice

- **Modules as an interface.** A route is a module that exports `loader` and a default
  component. You never call either one; you export them and the framework decides when.
- **`Promise.all`.** In `item_view.jsx` the item and its reviews are fetched concurrently.
  Split them into two sequential awaits and the waterfall is visible in the network tab —
  the same code, one refactor apart, twice the latency.
- **Destructured parameters again.** `loader({ params })` and `Component({ loaderData })`
  are the same dict-as-arguments pattern as props.


#### SCRATCH

persist client cart in layout, add from items view, allow change quantity or remove
- can do pending/error state there too
checkin code v. number, git v. login

