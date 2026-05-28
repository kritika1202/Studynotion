import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchMyEnrollments = createAsyncThunk("enrollments/fetchMine", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/enrollments/my");
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to load enrollments");
  }
});

export const enrollInCourse = createAsyncThunk("enrollments/enroll", async (courseId, { rejectWithValue }) => {
  try {
    const res = await api.post("/enrollments", { courseId });
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Enrollment failed");
  }
});

const enrollmentSlice = createSlice({
  name: "enrollments",
  initialState: {
    list: [],
    loading: false,
    enrolling: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyEnrollments.pending, (state) => { state.loading = true; })
      .addCase(fetchMyEnrollments.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchMyEnrollments.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(enrollInCourse.pending, (state) => { state.enrolling = true; state.error = null; })
      .addCase(enrollInCourse.fulfilled, (state, action) => {
        state.enrolling = false;
        state.list.unshift(action.payload);
      })
      .addCase(enrollInCourse.rejected, (state, action) => { state.enrolling = false; state.error = action.payload; });
  },
});

export default enrollmentSlice.reducer;
