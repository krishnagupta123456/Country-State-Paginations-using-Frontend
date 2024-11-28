import React, { useState, useEffect } from "react";
import "./App.css";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const Country = () => {
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [newCountry, setNewCountry] = useState({ name: "" });
    const [editingCountry, setEditingCountry] = useState(null);
    const pageSize = 5;

    useEffect(() => {
        fetchCountries(currentPage);
    }, [currentPage]);

    // Fetch countries with pagination
    const fetchCountries = async (page) => {
        setLoading(true);
        try {
            const response = await fetch(
                `http://localhost:8080/country?pageNo=${page}&pageSize=${pageSize}`
            );
            const result = await response.json();
            setCountries(result.content || []);
            setTotalPages(result.totalPages || 0);
        } catch (error) {
            console.error("Error fetching countries:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 0) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCountry({ ...newCountry, [name]: value });
    };

    // Add a new country
    const addCountry = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/country", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCountry),
            });
            if (response.ok) {
                fetchCountries(currentPage);
                setNewCountry({ name: "" });
            } else {
                console.error("Failed to add country.");
            }
        } catch (error) {
            console.error("Error adding country:", error);
        }
    };

    // Start editing a country
    const startEditing = (country) => {
        setEditingCountry(country);
        setNewCountry({ name: country.name });
    };

    // Update an existing country
    const updateCountry = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/country/${editingCountry.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCountry),
            });
            if (response.ok) {
                fetchCountries(currentPage);
                setEditingCountry(null);
                setNewCountry({ name: "" });
            } else {
                console.error("Failed to update country.");
            }
        } catch (error) {
            console.error("Error updating country:", error);
        }
    };

    // Delete a country
    const deleteCountry = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/country/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                fetchCountries(currentPage);
            } else {
                console.error("Failed to delete country.");
            }
        } catch (error) {
            console.error("Error deleting country:", error);
        }
    };

    // Download the countries as a PDF
    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text('Country List', 20, 10);

        const tableColumn = ['ID', 'Name'];
        const tableRows = countries.map(country => [country.id, country.name]);

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20,
        });

        doc.save('countries.pdf');
    };

    const generateExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(
            countries.map(country => ({
                ID: country.id,
                Name: country.name,
            }))
        );
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Countries');

        XLSX.writeFile(workbook, 'countries.xlsx');
    };

    return (
        <>
            <div className="container">
                <h3>Country Management</h3>

                {/* Add/Update Country Form */}
                <form onSubmit={editingCountry ? updateCountry : addCountry}>
                    <div className='form-group'>
                        <label htmlFor="name">Name: </label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter the Country Name"
                            value={newCountry.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <button type="submit">{editingCountry ? "Update Country" : "Add Country"}</button>
                    {editingCountry && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditingCountry(null);
                                setNewCountry({ name: "" });
                            }}
                        >
                            Cancel
                        </button>
                    )}
                </form>

            </div>

            {/* Country Table */}
            <div className='tableData'>
                <h3>Country Lists</h3>
                {loading ? (
                    <p>Loading...</p>
                ) : countries.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {countries.map((country) => (
                                <tr key={country.id}>
                                    <td>{country.id}</td>
                                    <td>{country.name}</td>
                                    <td>
                                        <button onClick={() => startEditing(country)}>Edit</button>
                                        <button onClick={() => deleteCountry(country.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No data available</p>
                )}

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
                    <button onClick={generatePDF}>Generate PDF</button>
                    <button onClick={generateExcel}>Export to Excel</button>
                </div>
            </div>
        </>
    );
};

export default Country;
