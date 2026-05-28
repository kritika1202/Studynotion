import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchCourses = createAsyncThunk("courses/fetchAll", async (params = {}, { rejectWithValue }) => {
  try {
    const res = await api.get("/courses", { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to load courses");
  }
});

export const fetchFeaturedCourses = createAsyncThunk("courses/featured", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/courses/featured");
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to load featured courses");
  }
});

export const fetchCourseById = createAsyncThunk("courses/fetchOne", async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/courses/${id}`);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Course not found");
  }
});

const courseSlice = createSlice({
  name: "courses",
  initialState: {
    list: [],
    featured: [],
    selected: null,
    pagination: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelected(state) { state.selected = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCourses.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchFeaturedCourses.fulfilled, (state, action) => { state.featured = action.payload; })
      .addCase(fetchCourseById.pending, (state) => { state.loading = true; state.selected = null; })
      .addCase(fetchCourseById.fulfilled, (state, action) => { state.loading = false; state.selected = action.payload; })
      .addCase(fetchCourseById.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearSelected } = courseSlice.actions;
export default courseSlice.reducer;
