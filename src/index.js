import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();



// import React, { useState, useEffect } from "react";
// import axios from 'axios';
// import "./App.css";

// const State = () => {
//     const [states, setStates] = useState([]);
//     const [countries, setCountries] = useState([]);
//     const [editId, setEditId] = useState(null);
//     const [name, setName] = useState('');
//     const [selectedCountry, setSelectedCountry] = useState('');
//     const [currentStatePage, setCurrentStatePage] = useState(0);
//     const statePageSize= 5;
//     const [stateTotalPages, setStateTotalPages] = useState(0);
//     const [selectedState, setSelectedState] = useState(null);

//     useEffect(() => {
//         fetchStates(currentStatePage);
//         fetchCountries();
//     }, [currentStatePage, statePageSize]);

//     // Fetch states with pagination
    
//     const fetchStates = (page) => {
//         axios.get(`http://localhost:8080/state?page=${page}&size=${statePageSize}`)
//             .then(response => {
//                 setStates(response.data.content || []);
//                 setStateTotalPages(response.data.totalPages);
//             })
//             .catch(error => {
//                 console.error('Error fetching states:', error.message);
//             });
//     };

//     // Fetch all countries for dropdown
//     const fetchCountries = () => {
//         axios.get('http://localhost:8080/country')
//             .then(response => {
//                 setCountries(response.data.content || []);
//             })
//             .catch(error => {
//                 console.error('Error fetching countries:', error.message);
//             });
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         const state = {
//             name,
//             country: selectedCountry,
//         };

//         if (editId) {
//             axios.put(`http://localhost:8080/state/${editId}`, state)
//                 .then(() => {
//                     fetchStates(currentStatePage);
//                     resetForm();
//                 })
//                 .catch(error => {
//                     console.error('Error updating the state!', error);
//                 });

//         } else {
//             axios.post('http://localhost:8080/state', state)
//                 .then(() => {
//                     fetchStates(currentStatePage);
//                     resetForm();
//                 })
//                 .catch(error => {
//                     console.error('Error creating the state!', error);
//                 });
//         }
//     };

//     const resetForm = () => {
//         setEditId(null);
//         setName('');
//         setSelectedCountry('');
//         setSelectedState(null);
//     };

//     const handleEdit = (state) => {
//         setEditId(state.id);
//         setName(state.name);
//         setSelectedCountry(state.country);
//     };

//     const handleView = (state) => {
//         setSelectedState(state);
//     };

//     const handleDelete = (id) => {
//         const isConfirmed = window.confirm("Are you sure you want to delete this state?");
//         if (isConfirmed) {
//             axios.delete(`http://localhost:8080/state/${id}`)
//                 .then(() => {
//                     fetchStates(currentStatePage);
//                 })
//                 .catch(error => {
//                     console.error('Error deleting the state!', error);
//                 });
//         }
//     };

//     const handlePrevious = () => {
//         if (currentStatePage > 0) setCurrentStatePage(currentStatePage - 1);
//     };

//     const handleNext = () => {
//         if (currentStatePage < stateTotalPages - 1) setCurrentStatePage(currentStatePage + 1);
//     };

//     // const handleInputChange = (e) => {
//     //     const { name, value } = e.target;
//     //     setNewState({ ...newState, [name]: value });
//     // };

//     // // Add a new state
//     // const addState = async (e) => {
//     //     e.preventDefault();
//     //     try {
//     //         const response = await fetch("http://localhost:8080/state", {
//     //             method: "POST",
//     //             headers: { "Content-Type": "application/json" },
//     //             body: JSON.stringify(newState),
//     //         });
//     //         if (response.ok) {
//     //             fetchStates(currentPage);
//     //             setNewState({ name: "", countryId: "" });
//     //         } else {
//     //             console.error("Failed to add state.");
//     //         }
//     //     } catch (error) {
//     //         console.error("Error adding state:", error);
//     //     }
//     // };

//     // // Start editing a state
//     // const startEditing = (state) => {
//     //     setEditingState(state);
//     //     setNewState({ name: state.name, countryId: state.countryId });
//     // };

//     // // Update an existing state
//     // const updateState = async (e) => {
//     //     e.preventDefault();
//     //     try {
//     //         const response = await fetch(`http://localhost:8080/state/${editingState.id}`, {
//     //             method: "PUT",
//     //             headers: { "Content-Type": "application/json" },
//     //             body: JSON.stringify(newState),
//     //         });
//     //         if (response.ok) {
//     //             fetchStates(currentPage);
//     //             setEditingState(null);
//     //             setNewState({ name: "", countryId: "" });
//     //         } else {
//     //             console.error("Failed to update state.");
//     //         }
//     //     } catch (error) {
//     //         console.error("Error updating state:", error);
//     //     }
//     // };

//     // // Delete a state
//     // const deleteState = async (id) => {
//     //     try {
//     //         const response = await fetch(`http://localhost:8080/state/${id}`, {
//     //             method: "DELETE",
//     //         });
//     //         if (response.ok) {
//     //             fetchStates(currentPage);
//     //         } else {
//     //             console.error("Failed to delete state.");
//     //         }
//     //     } catch (error) {
//     //         console.error("Error deleting state:", error);
//     //     }
//     // };

//     return (
//         <>
//             <div className="container">
//                 <h3>States Management</h3>

//                 {/* Add/Update State Form */}
//                 <form onSubmit={handleSubmit}>
//                     <div className="form-group">
//                         <label htmlFor="name">State Name:</label>
//                         <label htmlFor="name">Name: </label>
//                         <input
//                             type="text"
//                             placeholder="Enter the State Name"
//                             value={name}
//                             onChange={(e) => setName(e.target.value)}
//                             required
//                         />
//                     </div>
//                     <div className='form-group'>
//                         <label htmlFor="country">Country:</label>
//                         <select
//                             value={selectedCountry}
//                             onChange={(e) => setSelectedCountry(e.target.value)}
//                             required
//                         >
//                             <option value="">Select Country</option>
//                             {Array.isArray(countries) && countries.map(country => (
//                                 <option key={country.id} value={country.name}>{country.name}</option>
//                             ))}
//                         </select>
//                     </div>
//                     <button type="submit">{editId ? 'Update State' : 'Add State'}</button>
//                     <button type="button" onClick={resetForm}>Reset</button>
//                 </form>
//             </div>

//             {/* State Table */}
//             <div className="tableData">
//                 <h3>State Lists</h3>
                
//                     <table>
//                         <thead>
//                             <tr>
//                                 <th>ID</th>
//                                 <th>Name</th>
//                                 <th>Country</th>
//                                 <th>Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {states.map((state) => (
//                                 <tr key={state.id}>
//                                     <td>{state.id}</td>
//                                     <td>{state.name}</td>
//                                     <td>{state.country}</td>
//                                     <td>
//                                     <button onClick={() => handleEdit(state)}>Edit</button>
//                                     <button onClick={() => handleView(state)}>View</button>
//                                     <button onClick={() => handleDelete(state.id)}>Delete</button>
//                                 </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
                

//                 {/* Pagination Controls */}
//                 <div className="datapage">
//                     <button onClick={handlePrevious} disabled={currentStatePage === 0}>
//                         Previous
//                     </button>
//                     <span>
//                          Page {currentStatePage + 1} of {stateTotalPages}
//                     </span>
//                     <button onClick={handleNext} disabled={currentStatePage === stateTotalPages - 1}>
//                         Next
//                     </button>
//                 </div>

//                 {selectedState && (
//                 <div className="state-details">
//                     <h2>State Details</h2>
//                     <p><strong>Name:</strong> {selectedState.name}</p>
//                     <p><strong>Country:</strong> {selectedState.country}</p>
//                     <button onClick={resetForm}>Close</button>
//                 </div>
//             )}
//             </div>
//         </>
//     );
// };

// export default State;

