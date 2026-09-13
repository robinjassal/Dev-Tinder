# DevTinder Frontend

A simple React + Redux Toolkit frontend for your existing `dev Tinder` backend.
No framer-motion, no extra libraries beyond the essentials — just plain CSS and 4 small Redux slices.

## How the code is organized

```
src/
  api/axiosInstance.js        one shared axios instance (baseURL + cookies)
  app/store.js                combines all slices into the Redux store
  features/
    auth/authSlice.js         signup, login, logout, session check, edit profile
    feed/feedSlice.js         load feed, send interested/ignored
    requests/requestsSlice.js load received requests, accept/reject
    connections/connectionsSlice.js  load matched connections
  components/
    Navbar.jsx
    UserCard.jsx               the card shown in the feed
    ProtectedRoute.jsx          redirects to /login if not logged in
  pages/
    Login.jsx / Signup.jsx
    Feed.jsx                    the swipe-style feed
    Requests.jsx / Connections.jsx / Profile.jsx
  index.css                   all styling, plain CSS with variables at the top
```

Each slice follows the same shape: a couple of `createAsyncThunk` calls to hit
the API, and an `extraReducers` block to update state when they succeed or fail.
That's the whole pattern — copy it if you add more features later.

## How the feed works

- `Feed.jsx` loads profiles with `fetchFeed`.
- The top card is actually draggable: `onPointerDown` / `onPointerMove` /
  `onPointerUp` in `Feed.jsx` track how far you've dragged (`dragX`), and the
  card follows your finger/mouse via an inline `transform`. One set of pointer
  handlers works for both mouse and touch — no separate touch code, no library.
- Drag past 100px and it counts as a swipe; drag less than that and it snaps
  back to center. You can also just tap the ♥ / ✕ buttons — same result.
- While dragging, a "LIKE" or "NOPE" stamp fades in based on drag distance
  (see the `likeOpacity` / `nopeOpacity` math in `UserCard.jsx`).
- On a confirmed swipe, `sendConnectionRequest({ status, userId })` fires,
  hitting `POST /request/send/:status/:toUserId` (status is `interested` or
  `ignored`, matching your backend exactly). The card gets a `leaving-left` /
  `leaving-right` class to fly off screen, then is removed from the Redux list.
- Two more profiles peek out behind the top card (scaled down, slightly
  offset) for a real stacked-carousel look, not just a flat list.

## Mobile layout

- Below 720px wide, the top nav links are replaced by a fixed bottom tab bar
  (Feed / Requests / Matches / Profile / Logout) — the standard pattern for
  this kind of app, instead of squeezing links into a thin top strip.
- All buttons and inputs keep a minimum 44px touch target.
- The card stack height uses `clamp()` so it fits comfortably on both short
  and tall phone screens without needing JS to measure the viewport.

## Running it

**1. Backend** (from your `dev Tinder` folder):
```bash
npm install
npm run dev        # starts on http://localhost:5000
```
Make sure your `.env` there has `MONGO_URL` and `SECRET_KEY_JWT` set.

**2. Frontend** (this folder):
```bash
npm install
cp .env.example .env   # only needed if your backend isn't on localhost:5000
npm run dev             # starts on http://localhost:5173
```

Open http://localhost:5173, sign up, then log in.

## Why login works across refreshes

Your backend logs users in with an httpOnly cookie (`res.cookie("token", ...)`),
not a token you store in JS. So:
- `axiosInstance` is created with `withCredentials: true` so the cookie is sent
  with every request.
- On app load, `App.jsx` dispatches `fetchCurrentUser()` which calls
  `GET /profile/view` — if the cookie is still valid, the user stays logged in.

Keep the frontend on port `5173`: your backend's CORS is hardcoded to allow
only `http://localhost:5173`.

## Things you might want to add next

- Pagination on the feed (your backend already supports `?page=&limit=`)
- A toast/snackbar for the request messages (`"X is interested in Y"`)
- Loading skeletons instead of plain "Loading..." text
