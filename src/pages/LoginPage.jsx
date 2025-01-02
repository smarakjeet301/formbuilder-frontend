import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { login } from "../features/auth/authSlice"; // Assuming you have a login action in authSlice

const LoginPage = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { loading, error, user } = useSelector((state) => state.auth);

	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [errors, setErrors] = useState({});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const validateForm = () => {
		const newErrors = {};
		if (!formData.email) {
			newErrors.email = "Email is required.";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Email is invalid.";
		}

		if (!formData.password) {
			newErrors.password = "Password is required.";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (validateForm()) {
			dispatch(login({ email: formData.email, password: formData.password }));
		}
	};

	// Redirect to dashboard after successful login
	useEffect(() => {
		if (user) {
			navigate("/dashboard"); // Redirect to the dashboard
		}
	}, [user, navigate]);

	return (
		<div className="flex justify-center items-center h-screen bg-gray-100">
			<div className="bg-white p-8 rounded-lg shadow-md w-96">
				<h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
				<form onSubmit={handleSubmit} noValidate>
					<div className="mb-4">
						<label htmlFor="email" className="block text-gray-700 font-medium">
							Email
						</label>
						<input
							type="email"
							id="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							className={`w-full p-2 border rounded ${
								errors.email ? "border-red-500" : "border-gray-300"
							}`}
						/>
						{errors.email && (
							<p className="text-red-500 text-sm mt-1">{errors.email}</p>
						)}
					</div>
					<div className="mb-6">
						<label
							htmlFor="password"
							className="block text-gray-700 font-medium"
						>
							Password
						</label>
						<input
							type="password"
							id="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							className={`w-full p-2 border rounded ${
								errors.password ? "border-red-500" : "border-gray-300"
							}`}
						/>
						{errors.password && (
							<p className="text-red-500 text-sm mt-1">{errors.password}</p>
						)}
					</div>
					<button
						type="submit"
						className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
						disabled={loading}
					>
						{loading ? "Logging in..." : "Login"}
					</button>
					{error && <p className="text-red-500 text-center mt-4">{error}</p>}
				</form>
				<p className="text-center mt-4">
					Don't have an account?{" "}
					<span
						className="text-blue-500 cursor-pointer hover:underline"
						onClick={() => navigate("/register")}
					>
						Register
					</span>
				</p>
			</div>
		</div>
	);
};

export default LoginPage;
