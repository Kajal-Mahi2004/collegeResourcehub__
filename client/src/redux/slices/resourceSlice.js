import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  resources: [],
  currentResource: null,
  totalResources: 0,
  totalPages: 0,
  currentPage: 1,
  loading: false,
  error: null
};

const resourceSlice = createSlice({
  name: 'resource',
  initialState,
  reducers: {
    setResourcesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    setResourcesSuccess: (state, action) => {
      state.resources = action.payload.resources;
      state.totalResources = action.payload.totalResources;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
      state.loading = false;
    },
    setResourcesError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setCurrentResource: (state, action) => {
      state.currentResource = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    }
  }
});

export const {
  setResourcesStart,
  setResourcesSuccess,
  setResourcesError,
  setCurrentResource,
  setCurrentPage
} = resourceSlice.actions;

export default resourceSlice.reducer;
