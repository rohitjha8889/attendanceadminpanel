"use client"
import React, { useState, useContext, useEffect } from 'react';
import { DataContext } from '../Data/DataContext';
import './style.css';
import { IoMdClose } from "react-icons/io";

function Page() {

    const { services, fetchServices, IP_Address, addClient, allClient, deleteClient } = useContext(DataContext);
    const [showPopup, setShowPopup] = useState(false); // State to manage popup visibility
    const [showAddClientPopup, setShowAddClientPopup] = useState(false); // State to manage "Add Client" popup visibility
    const [newServiceName, setNewServiceName] = useState('');
    // const [selectedHospitalName, setSelectedHospitalName] = useState('');
    // const [selectedWorkingHour, setSelectedWorkingHour] = useState('');
    const [newClientData, setNewClientData] = useState({
        hospitalName: '',
        service: '',
        morningShift: '', // New state for morning shift
        eveningShift: '', // New state for evening shift
        nightShift: ''
    });
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        fetchServices();
    }, []);

    // const handleInputChange = (field, value) => {
    //     setNewClientData({ ...newClientData, [field]: value });
    // };



    const handleAddService = () => {
        setShowPopup(true); // Show the popup
    };

    const handleClosePopup = () => {
        setShowPopup(false); // Hide the popup
    };

    const handleSaveService = async () => {
        try {
            const response = await fetch(`${IP_Address}/service/addservice`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: newServiceName }),
            });
            if (!response.ok) {
                throw new Error('Failed to add service');
            }
            console.log('New service added:', newServiceName);
            setNewServiceName('');
            handleClosePopup();
            fetchServices();
        } catch (error) {
            console.error('Error adding service:', error);
        }
    };

    const handleAddClient = () => {
        setShowAddClientPopup(true);
    };

    const handleCloseAddClientPopup = () => {
        setShowAddClientPopup(false);
    };

    const handleSaveClient = () => {
        const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM) - (0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;
    
        // Check if all shift times match the required format
        if ((newClientData.morningShift && !timeRegex.test(newClientData.morningShift)) || 
            (newClientData.eveningShift && !timeRegex.test(newClientData.eveningShift)) || 
            (newClientData.nightShift && !timeRegex.test(newClientData.nightShift))) {
            alert('Please enter time in the format: HH:MM AM/PM - HH:MM AM/PM');
            return; // Prevent further execution
        }
    
        // Validate hospital name format
        if (newClientData.hospitalName.charAt(0) !== newClientData.hospitalName.charAt(0).toUpperCase()) {
            alert('The first letter of the hospital name should be capital Letter.');
            return; // Prevent further execution
        }
    
        // Add client data
        addClient(newClientData);
        console.log('New client added:', newClientData);
        setNewClientData({
            hospitalName: '',
            service: '',
            workingHour: ''
        });
        handleCloseAddClientPopup();
    };

    const handleDeleteClient = (clientId) => {
        // console.log(clientId)
        if (window.confirm('Are you sure you want to delete this client?')) {
            deleteClient(clientId);
        }
    };


    const handleHospitalNameChange = (value) => {
        setNewClientData({ ...newClientData, hospitalName: value });

        // If the input value is empty, show all clients initially
        if (value.trim() === '') {
            setSuggestions(allClient);
        } else {
            // Filter suggestions based on input value and remove duplicates
            const filteredSuggestions = allClient
                .filter((client, index, self) =>
                    index === self.findIndex((c) => (
                        c.hospitalName.toLowerCase() === client.hospitalName.toLowerCase()
                    ))
                )
                .filter(client => client.hospitalName.toLowerCase().includes(value.toLowerCase()));
            setSuggestions(filteredSuggestions);
        }
    };

    const selectSuggestion = (suggestion) => {
        setNewClientData({ ...newClientData, hospitalName: suggestion.hospitalName });
        setSuggestions([]);
    };


    return (
        <div className="clientTable-container">
            <div>
                <h1>All Clients</h1>
                <div>
                    <button className="button" onClick={handleAddService}>Add Service</button>
                    <button className="button" onClick={handleAddClient}>Add Client</button>
                </div>
            </div>
            <table className="clientTable">
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Hospital Name</th>
                        <th>Service</th>
                        <th>Morning</th>
                        <th>Evening</th>
                        <th>Night</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {allClient.map((client, index) => (
                        <tr key={client.id}>
                            <td>{index + 1}</td>
                            <td>{client.hospitalName}</td>
                            <td>
                                {client.service}
                            </td>
                            <td>{client.morningShift}</td>
                            <td>{client.eveningShift}</td>
                            <td>{client.nightShift}</td>
                        
                            <td>
                                {allClient.length > 0 && <button className="button danger" onClick={() => handleDeleteClient(client._id)}>Delete</button>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* "Add Client" Popup */}
            {showAddClientPopup && (
                <div className="popup-container">
                    <div className="popup">
                        <div>
                            <h2>Add New Client</h2>
                            <button className="button danger" onClick={handleCloseAddClientPopup}><IoMdClose size={20} /></button>
                        </div>
                        <input type="text" placeholder="Hospital Name" value={newClientData.hospitalName} onChange={(e) => handleHospitalNameChange(e.target.value)} />
                        {/* Suggestions list */}
                        <div className="suggestions">
                            {suggestions.map((suggestion, index) => (
                                <div key={index} className="suggestion" onClick={() => selectSuggestion(suggestion)}>
                                    {suggestion.hospitalName}
                                </div>
                            ))}
                        </div>

                        <select value={newClientData.service} onChange={(e) => setNewClientData({ ...newClientData, service: e.target.value })}>
                            <option value="">Select Service</option>
                            {services.map(service => (
                                <option key={service.id} value={service.name}>{service.name}</option>
                            ))}
                        </select>
                        <input type="text" placeholder="Morning Shift" value={newClientData.morningShift} onChange={(e) => setNewClientData({ ...newClientData, morningShift: e.target.value })} />



                        
                        <input type="text" placeholder="Evening Shift" value={newClientData.eveningShift} onChange={(e) => setNewClientData({ ...newClientData, eveningShift: e.target.value })} />
                        <input type="text" placeholder="Night Shift" value={newClientData.nightShift} onChange={(e) => setNewClientData({ ...newClientData, nightShift: e.target.value })} />

                        <button className="button primary" onClick={handleSaveClient}>Save</button>
                    </div>
                </div>
            )}
            {/* "Add Service" Popup */}
            {showPopup && (
                <div className="popup-container">
                    <div className="popup">
                        <div>
                            <h2>Add New Service</h2>
                            <button className="button danger" onClick={handleClosePopup}><IoMdClose size={20} /></button>
                        </div>
                        <input type="text" placeholder="Enter service name" value={newServiceName} onChange={(e) => setNewServiceName(e.target.value)} />
                        <button className="button primary" onClick={handleSaveService}>Save</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Page;
