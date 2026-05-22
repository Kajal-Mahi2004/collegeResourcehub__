import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import academicReducer from './slices/academicSlice';
import resourceReducer from './slices/resourceSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    academic: academicReducer,
    resource: resourceReducer
  }
});

export default store;
