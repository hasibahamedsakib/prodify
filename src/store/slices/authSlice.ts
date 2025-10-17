import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  email: string | null;
  isAuthenticated: boolean;
}

// Initialize state from localStorage if available
const getInitialState = (): AuthState => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    if (token && email) {
      return {
        token,
        email,
        isAuthenticated: true,
      };
    }
  }

  return {
    token: null,
    email: null,
    isAuthenticated: false,
  };
};

const initialState: AuthState = getInitialState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; email: string }>
    ) => {
      state.token = action.payload.token;
      state.email = action.payload.email;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.token = null;
      state.email = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
