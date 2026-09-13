import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const fetchFeed = createAsyncThunk(
  "feed/fetchFeed",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/user/feed");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Could not load feed");
    }
  },
);

// status is either "interested" or "ignored" (matches the backend's allowed values)
export const sendConnectionRequest = createAsyncThunk(
  "feed/sendConnectionRequest",
  async ({ status, userId }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        `/request/send/${status}/${userId}`,
      );
      return { userId, message: res.data.message };
    } catch (err) {
      return rejectWithValue(err.response?.data || "Action failed");
    }
  },
);

const feedSlice = createSlice({
  name: "feed",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendConnectionRequest.fulfilled, (state, action) => {
        // pop the swiped user out of the stack
        state.users = state.users.filter(
          (u) => u._id !== action.payload.userId,
        );
      });
  },
});

export default feedSlice.reducer;
