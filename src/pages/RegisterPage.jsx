import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register } from "../features/auth/authSlice";

const RegisterPage = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { loading, error, user } = useSelector((state) => state.auth);

	const [formData, setFormData] = useState({
		email: "",
		password: "",
		confirmPassword: "",
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
		} else if (formData.password.length < 8) {
			newErrors.password = "Password must be at least 8 characters.";
		}

		if (!formData.confirmPassword) {
			newErrors.confirmPassword = "Confirm Password is required.";
		} else if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = "Passwords do not match.";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (validateForm()) {
			dispatch(
				register({ email: formData.email, password: formData.password })
			);
		}
	};

	useEffect(() => {
		if (user) {
			navigate("/login"); // Redirect to the dashboard
		}
	}, [user, navigate]);

	return (
		<div className="flex justify-center items-center h-screen bg-gray-100">
			<div className="bg-white p-8 rounded-lg shadow-md w-96">
				<h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
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
					<div className="mb-4">
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
					<div className="mb-6">
						<label
							htmlFor="confirmPassword"
							className="block text-gray-700 font-medium"
						>
							Confirm Password
						</label>
						<input
							type="password"
							id="confirmPassword"
							name="confirmPassword"
							value={formData.confirmPassword}
							onChange={handleChange}
							className={`w-full p-2 border rounded ${
								errors.confirmPassword ? "border-red-500" : "border-gray-300"
							}`}
						/>
						{errors.confirmPassword && (
							<p className="text-red-500 text-sm mt-1">
								{errors.confirmPassword}
							</p>
						)}
					</div>
					<button
						type="submit"
						className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
						disabled={loading}
					>
						{loading ? "Registering..." : "Register"}
					</button>
					{error && <p className="text-red-500 text-center mt-4">{error}</p>}
				</form>

				<p className="text-center mt-4">
					Already have a account?{" "}
					<span
						className="text-blue-500 cursor-pointer hover:underline"
						onClick={() => navigate("/login")}
					>
						Login
					</span>
				</p>
			</div>
		</div>
	);
};

export default RegisterPage;
