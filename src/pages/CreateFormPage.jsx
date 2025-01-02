import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { createForm, updateForm } from "../features/forms/formSlice";

const inputTypes = [
	{ id: "text", label: "Text" },
	{ id: "email", label: "Email" },
	{ id: "radio", label: "Radio Button" },
	{ id: "textarea", label: "Textarea" },
];

const CreateFormPage = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();

	// Check if editing an existing form
	const existingForm = location.state?.form || null;

	// States
	const [formName, setFormName] = useState("");
	const [formDescription, setFormDescription] = useState("");
	const [formFields, setFormFields] = useState([]);

	// Prepopulate fields in Edit mode
	useEffect(() => {
		if (existingForm) {
			setFormName(existingForm.formName);
			setFormDescription(existingForm.formDescription);
			setFormFields(existingForm.formFields);
		}
	}, [existingForm]);

	const handleDragEnd = (result) => {
		if (!result.destination) return; // Exit if dropped outside a droppable area

		const { source, destination } = result;

		// Dragging from inputTypeList to formFields
		if (
			source.droppableId === "inputTypeList" &&
			destination.droppableId === "formFields"
		) {
			const draggedField = inputTypes[source.index];
			setFormFields((prevFields) => [
				...prevFields,
				{
					fieldName: "",
					fieldType: draggedField.id,
					required: false,
					placeholder: "",
					options: draggedField.id === "radio" ? [""] : [], // For radio button, we initialize with an empty option
				},
			]);
		}

		// Reordering within formFields (if you drag an existing field)
		if (
			source.droppableId === "formFields" &&
			destination.droppableId === "formFields"
		) {
			const reorderedFields = Array.from(formFields);
			const [removed] = reorderedFields.splice(source.index, 1);
			reorderedFields.splice(destination.index, 0, removed);
			setFormFields(reorderedFields);
		}
	};

	const handleFieldChange = (index, event) => {
		const updatedFields = [...formFields];
		updatedFields[index][event.target.name] = event.target.value;
		setFormFields(updatedFields);
	};

	const handleOptionChange = (fieldIndex, optionIndex, value) => {
		const updatedFields = [...formFields];
		updatedFields[fieldIndex].options[optionIndex] = value;
		setFormFields(updatedFields);
	};

	const addOption = (fieldIndex) => {
		const updatedFields = [...formFields];
		updatedFields[fieldIndex].options.push(
			`Option ${updatedFields[fieldIndex].options.length + 1}`
		);
		setFormFields(updatedFields);
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		const formData = {
			formName,
			formDescription,
			formFields,
			createdAt: new Date().toISOString(),
		};
		if (existingForm) {
			// Edit Mode: Update form
			dispatch(updateForm({ ...existingForm, ...formData }));
		} else {
			// Create Mode: Add new form
			dispatch(createForm(formData));
		}
		navigate("/dashboard");
	};

	return (
		<div className="container mx-auto p-6 max-w-4xl bg-gray-100 shadow-lg rounded-lg">
			<h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
				{existingForm ? "Edit Form" : "Create a New Form"}
			</h1>
			<DragDropContext onDragEnd={handleDragEnd}>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{/* Input Types */}
					<div className="col-span-1 bg-white shadow-md p-4 rounded-lg">
						<h2 className="text-xl font-semibold mb-4">Input Types</h2>
						<Droppable droppableId="inputTypeList" isDropDisabled={true}>
							{(provided) => (
								<div
									{...provided.droppableProps}
									ref={provided.innerRef}
									className="space-y-2"
								>
									{inputTypes.map((type, index) => (
										<Draggable
											key={type.id}
											draggableId={type.id}
											index={index}
										>
											{(provided) => (
												<div
													{...provided.draggableProps}
													{...provided.dragHandleProps}
													ref={provided.innerRef}
													className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer text-center"
												>
													{type.label}
												</div>
											)}
										</Draggable>
									))}
									{provided.placeholder}
								</div>
							)}
						</Droppable>
					</div>

					{/* Form Fields */}
					<div className="col-span-2 bg-white shadow-md p-4 rounded-lg">
						<form onSubmit={handleSubmit}>
							<div className="mb-4">
								<label className="block text-gray-700 text-sm font-bold mb-2">
									Form Name
								</label>
								<input
									type="text"
									value={formName}
									onChange={(e) => setFormName(e.target.value)}
									className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
									placeholder="Enter form name"
									required
								/>
							</div>
							<div className="mb-4">
								<label className="block text-gray-700 text-sm font-bold mb-2">
									Form Description
								</label>
								<textarea
									value={formDescription}
									onChange={(e) => setFormDescription(e.target.value)}
									className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
									placeholder="Enter form description"
									required
								></textarea>
							</div>
							<Droppable droppableId="formFields">
								{(provided, snapshot) => (
									<div
										{...provided.droppableProps}
										ref={provided.innerRef}
										className={`space-y-4 p-4 border rounded-lg bg-gray-50 shadow-sm ${
											snapshot.isDraggingOver ? "bg-blue-100" : ""
										}`}
									>
										{formFields.map((field, index) => (
											<Draggable
												key={`field-${index}`}
												draggableId={`field-${index}`}
												index={index}
											>
												{(provided) => (
													<div
														{...provided.draggableProps}
														{...provided.dragHandleProps}
														ref={provided.innerRef}
														className="p-4 border rounded-lg bg-white shadow-md"
													>
														{/* Field Name */}
														<div className="mb-2">
															<label className="block text-sm font-semibold text-gray-700">
																Field Name
															</label>
															<input
																type="text"
																name="fieldName"
																value={field.fieldName}
																onChange={(e) => handleFieldChange(index, e)}
																className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
																placeholder="Enter field name"
																required
															/>
														</div>

														{/* Placeholder Input for Text, Email, Textarea */}
														{(field.fieldType === "text" ||
															field.fieldType === "email" ||
															field.fieldType === "textarea") && (
															<div className="mb-2">
																<label className="block text-sm font-semibold text-gray-700">
																	Placeholder
																</label>
																<input
																	type="text"
																	name="placeholder"
																	value={field.placeholder}
																	onChange={(e) => handleFieldChange(index, e)}
																	className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
																	placeholder="Enter placeholder text"
																/>
															</div>
														)}

														{/* Render Textarea */}
														{field.fieldType === "textarea" && (
															<textarea
																className="w-full px-4 py-2 border rounded-lg"
																placeholder={field.placeholder || "Textarea"}
																disabled
															/>
														)}

														{/* Render Radio Options */}
														{field.fieldType === "radio" && (
															<div>
																<label className="block text-sm font-semibold text-gray-700">
																	Options
																</label>
																{field.options.map((option, optionIndex) => (
																	<div
																		key={optionIndex}
																		className="flex items-center mb-2"
																	>
																		<input
																			type="text"
																			value={option}
																			onChange={(e) =>
																				handleOptionChange(
																					index,
																					optionIndex,
																					e.target.value
																				)
																			}
																			className="w-full px-4 py-2 border rounded-lg"
																			placeholder={`Option ${optionIndex + 1}`}
																		/>
																	</div>
																))}
																<button
																	type="button"
																	onClick={() => addOption(index)}
																	className="text-blue-500 text-sm"
																>
																	Add Option
																</button>
															</div>
														)}

														{/* Required Checkbox */}
														<div className="mt-4">
															<input
																type="checkbox"
																name="required"
																checked={field.required}
																onChange={(e) =>
																	handleFieldChange(index, {
																		target: {
																			name: "required",
																			value: e.target.checked,
																		},
																	})
																}
															/>
															<label className="text-sm font-semibold text-gray-700 ml-1">
																Required
															</label>
														</div>
													</div>
												)}
											</Draggable>
										))}

										{provided.placeholder}
									</div>
								)}
							</Droppable>
							<button
								type="submit"
								className="w-full mt-4 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300"
							>
								{existingForm ? "Update Form" : "Create Form"}
							</button>
						</form>
					</div>
				</div>
			</DragDropContext>
		</div>
	);
};

export default CreateFormPage;
