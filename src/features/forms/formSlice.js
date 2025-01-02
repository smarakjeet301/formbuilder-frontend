import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axioInstance";

export const fetchForms = createAsyncThunk(
	"forms/fetchForms",
	async (_, { rejectWithValue }) => {
		try {
			// Get the auth token from the Redux state
			const token = localStorage.getItem("user");

			const response = await axiosInstance.get("/forms", {
				headers: {
					Authorization: `Bearer ${token}`, // Include the token in the header
				},
			});
			return response.data.forms; // Return the forms data
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || "Failed to fetch forms."
			);
		}
	}
);

export const updateForm = createAsyncThunk("forms/updateForm", async (form) => {
	const response = await axiosInstance.put(`/forms/${form.id}`, form);
	return response.data;
});

export const createForm = createAsyncThunk(
	"forms/createForm",
	async (formData, { rejectWithValue }) => {
		try {
			const token = localStorage.getItem("user");
			const response = await axiosInstance.post("/forms", formData, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			return response.data; // Return the newly created form data
		} catch (error) {
			return rejectWithValue(error.response.data); // Return error if the request fails
		}
	}
);

const formsSlice = createSlice({
	name: "forms",
	initialState: {
		forms: [], // Ensure this is an empty array initially
		loading: false,
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchForms.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchForms.fulfilled, (state, action) => {
				state.loading = false;
				state.forms = action.payload || []; // Ensure it is an array
			})
			.addCase(fetchForms.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});

export default formsSlice.reducer;
