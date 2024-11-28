import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './App.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const State = () => {
    const [states, setStates] = useState([]);
    const [countries, setCountries] = useState([]); 
    const [editId, setEditId] = useState(null);
    const [name, setName] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedState, setSelectedState] = useState(null);
    const pageSize = 5;

    useEffect(() => {
        fetchStates(currentPage); 
        fetchCountries(); 
    }, [currentPage]); 

    const fetchStates = (page) => {
        axios.get(`http://localhost:8080/state?pageNo=${page}&pageSize=${pageSize}`)
            .then(response => {
                setStates(response.data.content || []);
                setTotalPages(response.data.totalPages);
            })
            .catch(error => {
                console.error('Error fetching states:', error.message);
            });
    };

    const fetchCountries = () => {
        axios.get('http://localhost:8080/country')
            .then(response => {
                console.log('Countries API response:', response.data); 
                setCountries(response.data.content || []); 
            })
            .catch(error => {
                console.error('Error fetching countries:', error.message);
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const state = {
            name,
            country: selectedCountry,
        };

        if (editId) {
            axios.put(`http://localhost:8080/state/${editId}`, state)
                .then(() => {
                    fetchStates(currentPage);
                    resetForm();
                })
                .catch(error => {
                    console.error('Error updating the state!', error);
                });

        } else {
            axios.post('http://localhost:8080/state', state)
                .then(() => {
                    fetchStates(currentPage);
                    resetForm();
                })
                .catch(error => {
                    console.error('Error creating the state!', error);
                });
        }
    };

    const resetForm = () => {
        setEditId(null);
        setName('');
        setSelectedCountry('');
        setSelectedState(null);
    };


    const handleEdit = (state) => {
        setEditId(state.id);
        setName(state.name);
        setSelectedCountry(state.country);
    };

    const handleView = (state) => {
        setSelectedState(state);
    };

    const handleDelete = (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this state?");
        if (isConfirmed) {
            axios.delete(`http://localhost:8080/state/${id}`)
                .then(() => {
                    fetchStates(currentPage);
                })
                .catch(error => {
                    console.error('Error deleting the state!', error);
                });
        }
    };

    // Pagination controls
    const handlePrevious = () => {
        if (currentPage > 0) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
    };

    const generateStatePDF = () => {
        const doc = new jsPDF();
        doc.text('State List', 20, 10);

        const tableColumn = ['ID', 'State Name', 'Country'];
        const tableRows = states.map((state, index) => [
            index + 1,
            state.name,
            state.country,
        ]);

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20,
        });

        doc.save('state_list.pdf');
    };

    const generateStateExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(
            states.map(state => ({
                ID: state.id,
                Name: state.name,
                Country: state.country,
            }))
        );
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'States');
        XLSX.writeFile(workbook, 'state_list.xlsx');
    };


    return (
        <>
            <div className="container">
                <h3>States Management</h3>
                <form onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label htmlFor="name">Name: </label>
                        <input
                            type="text"
                            placeholder="Enter the State Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="country">Country:</label>
                        <select
                            value={selectedCountry}
                            onChange={(e) => setSelectedCountry(e.target.value)}
                            required
                        >
                            <option value="">Select Country</option>
                            {Array.isArray(countries) && countries.length > 0 ? (
                                countries.map(country => (
                                    <option key={country.id} value={country.name}>{country.name}</option>
                                ))
                            ) : (
                                <option value="">No countries available</option>
                            )}
                        </select>
                    </div>
                    <button type="submit">{editId ? 'Update State' : 'Add State'}</button>
                    <button type="button" onClick={resetForm}>Reset</button>
                </form>
            </div>

            <div className='tableData'>
                <h3>States Lists</h3>
                {states.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Country</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {states.map(state => (
                                <tr key={state.id}>
                                    <td>{state.name}</td>
                                    <td>{state.country}</td>
                                    <td>
                                        <button onClick={() => handleEdit(state)}>Edit</button>
                                        <button onClick={() => handleView(state)}>View</button>
                                        <button onClick={() => handleDelete(state.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No data available</p>
                )}
            </div>

            {/* Pagination Controls */}
            <div className="datapage">
                <button onClick={handlePrevious} disabled={currentPage === 0}>
                    Previous
                </button>
                <span>
                    Page {currentPage + 1} of {totalPages}
                </span>
                <button onClick={handleNext} disabled={currentPage === totalPages - 1}>
                    Next
                </button>
                <button onClick={generateStatePDF}>Generate PDF</button>
                <button onClick={generateStateExcel}>Generate Excel</button>
            </div>

            {selectedState && (
                <div className="modal-overlay">
                <div className="modal-content">
                  <button onClick={resetForm} className="close-btn">Close</button>
                  <h2 className='h1'>State Details</h2>
                  <div className='text'>
                  <p><strong>Name:</strong> {selectedState.name}</p>
                  <p><strong>Country:</strong> {selectedState.country}</p>
                  </div>
                </div>
              </div>
            )}
        </>
    );
};

export default State;
