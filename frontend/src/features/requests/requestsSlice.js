import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const fetchRequests = createAsyncThunk(
  "requests/fetchRequests",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/user/requests");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Could not load requests");
    }
  },
);

// status is either "accepted" or "rejected"
export const reviewRequest = createAsyncThunk(
  "requests/reviewRequest",
  async ({ status, requestId }, { rejectWithValue }) => {
    try {
      await axiosInstance.post(`/request/receive/${status}/${requestId}`);
      return requestId;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Action failed");
    }
  },
);

const requestsSlice = createSlice({
  name: "requests",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(reviewRequest.fulfilled, (state, action) => {
        state.items = state.items.filter((r) => r._id !== action.payload);
      });
  },
});

export default requestsSlice.reducer;
