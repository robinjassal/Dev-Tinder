import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import feedReducer from "../features/feed/feedSlice";
import requestsReducer from "../features/requests/requestsSlice";
import connectionsReducer from "../features/connections/connectionsSlice";

// This is the whole app's state, in one place:
// state.auth        -> who is logged in
// state.feed        -> profiles to swipe through
// state.requests    -> connection requests received
// state.connections -> people you've matched with
export const store = configureStore({
  reducer: {
    auth: authReducer,
    feed: feedReducer,
    requests: requestsReducer,
    connections: connectionsReducer,
  },
});
