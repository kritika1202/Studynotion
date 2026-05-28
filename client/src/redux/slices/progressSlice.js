import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchDashboardStats = createAsyncThunk("progress/dashboard", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/progress/dashboard/stats");
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to load dashboard stats");
  }
});

export const fetchCourseProgress = createAsyncThunk("progress/forCourse", async (courseId, { rejectWithValue }) => {
  try {
    const res = await api.get(`/progress/${courseId}`);
    return { courseId, ...res.data.data };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to load progress");
  }
});

export const markLectureComplete = createAsyncThunk(
  "progress/markLecture",
  async ({ courseId, lectureId }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/progress/${courseId}/lectures/${lectureId}`);
      return { courseId, ...res.data.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update progress");
    }
  }
);

const progressSlice = createSlice({
  name: "progress",
  initialState: {
    dashboard: null,
    byCourse: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => { state.loading = true; })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchCourseProgress.fulfilled, (state, action) => {
        state.byCourse[action.payload.courseId] = action.payload;
      })
      .addCase(markLectureComplete.fulfilled, (state, action) => {
        const { courseId, percentage, completedCount } = action.payload;
        if (state.byCourse[courseId]) {
          state.byCourse[courseId].percentage = percentage;
          state.byCourse[courseId].completedLectures = completedCount;
        }
        if (state.dashboard) {
          const course = state.dashboard.courses.find((c) => c.course._id === courseId);
          if (course) course.progress = percentage;
        }
      });
  },
});

export default progressSlice.reducer;
