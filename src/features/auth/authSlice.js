import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axioInstance";

export const login = createAsyncThunk("auth/login", async (credentials) => {
	const response = await axiosInstance.post("/auth/login", credentials);
	return response.data;
});

export const register = createAsyncThunk("auth/register", async (userData) => {
	const response = await axiosInstance.post("/auth/register", userData);
	return response.data;
});

const authSlice = createSlice({
	name: "auth",
	initialState: { user: null, token: null, loading: false, error: null },
	reducers: {
		logout: (state) => {
			state.user = null;
			localStorage.removeItem("user");
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(login.pending, (state) => {
				state.loading = true;
			})
			.addCase(login.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload.token;
				localStorage.setItem("user", action.payload.token);
			})
			.addCase(login.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			})
			.addCase(register.pending, (state) => {
				state.loading = true;
			})
			.addCase(register.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload.user;
				state.token = action.payload.token;
			})
			.addCase(register.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			});
	},
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
