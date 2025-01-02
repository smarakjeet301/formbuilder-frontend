import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchForms } from "../features/forms/formSlice";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { forms, loading, error } = useSelector((state) => state.forms);
	const user = localStorage.getItem("user");

	useEffect(() => {
		console.log(user);
		if (user) {
			dispatch(fetchForms()); // Fetch the forms when the component mounts
		} else {
			navigate("/login");
		}
	}, [dispatch, user, navigate]);

	// Handle Edit Form
	const handleEditForm = (id) => {
		navigate(`/edit-form/${id}`);
	};

	// Handle View Responses
	const handleViewResponses = (id) => {
		navigate(`/view-responses/${id}`);
	};

	// Handle Logout
	const handleLogout = () => {
		localStorage.removeItem("user");
		dispatch(logout());
		navigate("/login");
	};

	const handleCreate = () => {
		navigate("/createForm");
	};

	return (
		<div className="bg-gray-50 min-h-screen py-10 px-6">
			<div className="max-w-7xl mx-auto">
				{/* Dashboard Header */}
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
					<div>
						<button
							onClick={handleCreate}
							className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition duration-300 mr-10"
						>
							Create Form
						</button>
						<button
							onClick={handleLogout}
							className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 transition duration-300"
						>
							Logout
						</button>
					</div>
				</div>

				{/* Loading and Error Handling */}
				{loading && (
					<p className="text-center text-gray-500">Loading forms...</p>
				)}
				{error && <p className="text-center text-red-500">{error}</p>}

				{/* Forms List */}
				<div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{forms.length === 0 ? (
						<p className="text-center text-gray-500 col-span-3">
							No forms created yet.
						</p>
					) : (
						forms.map((form) => (
							<div
								key={form._id}
								className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
							>
								<div>
									<h3 className="text-2xl font-semibold text-gray-900 mb-2">
										{form.formName}
									</h3>
									<p className="text-gray-600 mb-4">
										Created on: {new Date(form.createdAt).toLocaleDateString()}
									</p>
								</div>
								<div className="flex space-x-4 mt-4">
									<button
										onClick={() => handleEditForm(form._id)}
										className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
									>
										Edit
									</button>
									<button
										onClick={() => handleViewResponses(form._id)}
										className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
									>
										View Responses
									</button>
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
};

export default DashboardPage;
