import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  courses: [],
  branches: [],
  semesters: [],
  subjects: [],
  selectedCourse: null,
  selectedBranch: null,
  selectedSemester: null,
  loading: false,
  error: null
};

const academicSlice = createSlice({
  name: 'academic',
  initialState,
  reducers: {
    // Courses
    setCoursesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    setCoursesSuccess: (state, action) => {
      state.courses = action.payload;
      state.loading = false;
    },
    setCoursesError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Branches
    setBranchesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    setBranchesSuccess: (state, action) => {
      state.branches = action.payload;
      state.loading = false;
    },
    setBranchesError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Semesters
    setSemestersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    setSemestersSuccess: (state, action) => {
      state.semesters = action.payload;
      state.loading = false;
    },
    setSemestersError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Subjects
    setSubjectsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    setSubjectsSuccess: (state, action) => {
      state.subjects = action.payload;
      state.loading = false;
    },
    setSubjectsError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Selection
    setSelectedCourse: (state, action) => {
      state.selectedCourse = action.payload;
      state.selectedBranch = null;
      state.selectedSemester = null;
      state.branches = [];
      state.semesters = [];
      state.subjects = [];
    },
    setSelectedBranch: (state, action) => {
      state.selectedBranch = action.payload;
      state.selectedSemester = null;
      state.semesters = [];
      state.subjects = [];
    },
    setSelectedSemester: (state, action) => {
      state.selectedSemester = action.payload;
      state.subjects = [];
    }
  }
});

export const {
  setCoursesStart,
  setCoursesSuccess,
  setCoursesError,
  setBranchesStart,
  setBranchesSuccess,
  setBranchesError,
  setSemestersStart,
  setSemestersSuccess,
  setSemestersError,
  setSubjectsStart,
  setSubjectsSuccess,
  setSubjectsError,
  setSelectedCourse,
  setSelectedBranch,
  setSelectedSemester
} = academicSlice.actions;

export default academicSlice.reducer;
