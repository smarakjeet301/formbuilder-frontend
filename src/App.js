import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import FormEditPage from "./pages/FormEditPage";
import LandingPage from "./pages/LandingPage";
import CreateFormPage from "./pages/CreateFormPage";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="/createForm" element={<CreateFormPage />} />
				<Route path="/edit-form/:id" element={<CreateFormPage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/register" element={<RegisterPage />} />
				<Route path="/dashboard" element={<DashboardPage />} />
				<Route path="/forms/:id" element={<FormEditPage />} />
			</Routes>
		</Router>
	);
}

export default App;
