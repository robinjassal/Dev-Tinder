import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// ---- API calls (thunks) ----

export const signupUser = createAsyncThunk(
  "auth/signup",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/signup", formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Signup failed");
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/login", formData);
      return res.data; // backend sends back the logged-in user object
    } catch (err) {
      return rejectWithValue(err.response?.data || "Login failed");
    }
  },
);

// Called once when the app first loads, to check if the login cookie is still valid
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/profile/view");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Not logged in");
    }
  },
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await axiosInstance.post("/logout");
  return true;
});

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put("/profile/edit", formData);
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Update failed");
    }
  },
);

// ---- Slice ----

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    checkingAuth: true, // true until we know if the user has a valid session
    loading: false,
    error: null,
  },
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // signup
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // session check on app load
      .addCase(fetchCurrentUser.pending, (state) => {
        state.checkingAuth = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.checkingAuth = false;
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.checkingAuth = false;
        state.user = null;
      })

      // logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })

      // update profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
