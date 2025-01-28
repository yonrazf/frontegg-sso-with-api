import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

// simple redux store implementation

interface UserState {
  user: any; // `any` type for user object
}

const initialState: UserState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<any>) {
      console.log("setting user to " + action);
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = {};
    },
    updateUser(state, action: PayloadAction<Partial<any>>) {
      state.user = { ...state.user, ...action.payload };
    },
  },
});

// Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    mfaRequired: false,
    accessToken: "",
    refreshToken: "",
    expiresIn: 0,
    expires: "",
    userId: "",
  },
  reducers: {
    setAuth: (state, action) => {
      return { ...state, ...action.payload };
    },
    clearAuth: () => ({
      mfaRequired: false,
      accessToken: "",
      refreshToken: "",
      expiresIn: 0,
      expires: "",
      userId: "",
    }),
  },
});

// Tenants Slice
const tenantsSlice = createSlice({
  name: "tenants",
  initialState: [],
  reducers: {
    setTenants: (state, action) => {
      return action.payload;
    },
  },
});

// Configure Store
const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    tenants: tenantsSlice.reducer,
    user: userSlice.reducer,
  },
});

// Export Actions
export const { setUser, clearUser, updateUser } = userSlice.actions;
export const { setAuth, clearAuth } = authSlice.actions;
export const { setTenants } = tenantsSlice.actions;

// Export Store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// export selectore=s
export const selectUser = (state: RootState) => state.user.user;
export const selectAuth = (state: RootState) => state.auth;
export const selectTenants = (state: RootState) => state.tenants;

export { store };
