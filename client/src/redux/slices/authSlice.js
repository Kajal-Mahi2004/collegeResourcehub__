import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  role: localStorage.getItem('userRole') || null,
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('token')
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Login
    setLoginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    setLoginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.role = action.payload.user.role;
      state.isAuthenticated = true;
      state.loading = false;
      
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('userRole', action.payload.user.role);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    setLoginError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Signup
    setSignupStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    setSignupSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.role = action.payload.user.role;
      state.isAuthenticated = true;
      state.loading = false;
      
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('userRole', action.payload.user.role);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    setSignupError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Logout
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      state.error = null;
      
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('user');
    },

    // Load user from localStorage
    loadUser: (state) => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      const role = localStorage.getItem('userRole');
      
      if (token && user && role) {
        state.token = token;
        state.user = JSON.parse(user);
        state.role = role;
        state.isAuthenticated = true;
      }
    }
  }
});

export const {
  setLoginStart,
  setLoginSuccess,
  setLoginError,
  setSignupStart,
  setSignupSuccess,
  setSignupError,
  logout,
  loadUser
} = authSlice.actions;

export default authSlice.reducer;
