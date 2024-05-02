"use client"
import React, { useState, useContext, useEffect } from 'react';
import { DataContext } from '../Data/DataContext';
import './style.css';
import { IoMdClose } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { FiEdit } from "react-icons/fi";


function Page() {
  const { services, fetchServices, IP_Address, allClient, addEmployee, allEmployee, deleteEmployee, fetchEmployeeDetail, updateEmployee} = useContext(DataContext);

  const [showAddClientPopup, setShowAddClientPopup] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    employeeName: '',
    employeePhone: '',
    hospitalName: '',
    service: '',
    attendancePermission: '',
    uniformPermission: ''
  });
  const [suggestions, setSuggestions] = useState([]);

  const [filterCriteria, setFilterCriteria] = useState({
    service: '',
    organization: '',
    phoneNumber: ''
  });


  const [showModifyEmployeePopup, setShowModifyEmployeePopup] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);



  const handleModifyEmployee = async (employeeId) => {
    try {
      const employeeData = await fetchEmployeeDetail(employeeId);
      setSelectedEmployee(employeeData);  
    setShowModifyEmployeePopup(true);
    } catch (error) {
      console.error("Error fetching employee details:", error);
    }
  };

  // Function to close modify employee popup
  const handleCloseModifyEmployeePopup = () => {
    setSelectedEmployee(null);
    setShowModifyEmployeePopup(false);
  };





  useEffect(() => {
    fetchServices();
  }, []);

  const handleAddEmployee = () => {
    setShowAddClientPopup(true);
  };

  const handleCloseAddEmployeePopup = () => {
    setShowAddClientPopup(false);
  };

  const handleSaveEmployee = () => {
    // Check if any field is empty
    if (!newEmployee.employeeName || !newEmployee.employeePhone || !newEmployee.hospitalName || !newEmployee.service || !newEmployee.attendancePermission || !newEmployee.uniformPermission) {
      alert('All fields are required.');
      return; // Prevent further execution
    }

    // Check if the first letter of the employee name is uppercase
    if (newEmployee.employeeName.charAt(0) !== newEmployee.employeeName.charAt(0).toUpperCase()) {
      alert('The first letter of the employee name should be a capital letter.');
      return; // Prevent further execution
    }

    // Check if phone number contains exactly 10 digits
    if (newEmployee.employeePhone.length !== 10 || isNaN(newEmployee.employeePhone)) {
      alert('Phone number should contain exactly 10 digits.');
      return; // Prevent further execution
    }

    addEmployee(newEmployee)

    console.log('New employee data:', newEmployee);
    // Add logic to save employee data as needed
    setNewEmployee({
      employeeName: '',
      employeePhone: '',
      hospitalName: '',
      service: '',
      attendancePermission: '',
      uniformPermission: ''
    });
    handleCloseAddEmployeePopup();
  };

  const handleDeleteEmployee = (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      deleteEmployee(employeeId)
    }
  };

  const handleHospitalNameChange = (value) => {
    setNewEmployee({ ...newEmployee, hospitalName: value });

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
    setNewEmployee({ ...newEmployee, hospitalName: suggestion.hospitalName });
    setSuggestions([]);
  };

  const handleSaveModifiedEmployee = () => {
    if (!selectedEmployee.employeeName || !selectedEmployee.employeePhone || !selectedEmployee.hospitalName || !selectedEmployee.service || !selectedEmployee.attendancePermission || !selectedEmployee.uniformPermission) {
      alert('All fields are required.');
      return; // Prevent further execution
    }

    if (selectedEmployee.employeeName.charAt(0) !== selectedEmployee.employeeName.charAt(0).toUpperCase()) {
      alert('The first letter of the employee name should be a capital letter.');
      return; // Prevent further execution
    }

    // Check if phone number contains exactly 10 digits
    if (selectedEmployee.employeePhone.toString().trim().length !== 10) {
      alert('Phone number should contain exactly 10 digits.');
      return; // Prevent further execution
    }

    const id = selectedEmployee._id;
    updateEmployee(id, selectedEmployee);
    handleCloseModifyEmployeePopup()
  }


  const filteredEmployees = allEmployee.filter(employee => {
    const matchService = filterCriteria.service ? employee.service === filterCriteria.service : true;
    const matchOrganization = filterCriteria.organization ? employee.hospitalName === filterCriteria.organization : true;
    const matchPhoneNumber = filterCriteria.phoneNumber ? employee.employeePhone.toString().includes(filterCriteria.phoneNumber) : true;
    const matchName = filterCriteria.phoneNumber ? employee.employeeName.toLowerCase().includes(filterCriteria.phoneNumber.toLowerCase()) : true;
    return matchService && matchOrganization && (matchPhoneNumber || matchName);
  });

  return (
    <div className="table-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>All Employees</h1>
        <div className='filterBox'>
          <input type="text" placeholder="Phone" onChange={(e) => setFilterCriteria({ ...filterCriteria, phoneNumber: e.target.value })} />

          
          <select value={filterCriteria.organization} onChange={(e) => setFilterCriteria({ ...filterCriteria, organization: e.target.value })}>
            <option value="">Select Organisation</option>
            {Array.from(new Set(allClient.map(client => client.hospitalName))).map((hospitalName, index) => (
              <option key={index} value={hospitalName}>{hospitalName}</option>
            ))}
          </select>

          <select value={filterCriteria.service} onChange={(e) => setFilterCriteria({ ...filterCriteria, service: e.target.value })}>
            <option value="">Select Service</option>
            {services.map(service => (
              <option key={service.id} value={service.name}>{service.name}</option>
            ))}
          </select>


          <button className="button" onClick={handleAddEmployee}>Add Employee</button>

        </div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Organisation</th>
            <th>Designation</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {/* Map through the employees and render each row */}
          {filteredEmployees.map((employee, index) => {
            let id = employee._id.slice(-5)
            return (
              <tr key={employee.id}>
                <td>#{id}</td>
                <td>{employee.employeeName}</td>
                <td>{employee.employeePhone}</td>
                <td>{employee.hospitalName}</td>
                <td>{employee.service}</td>

                <td>
                  {/* Render delete button for each employee */}
                  <div style={{ display: 'flex' }}>
                    <button className="button delete" onClick={() => handleDeleteEmployee(employee._id)}><MdDelete size={25} /></button>
                    <button className="button edit" onClick={() => handleModifyEmployee(employee._id)}><FiEdit size={25} /></button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* Add Employee Popup */}
      {showAddClientPopup && (
        <div className="popup-container">
          <div className="popup">
            <div>
              <h2>Add New Employee</h2>
              <button className="button danger" onClick={handleCloseAddEmployeePopup}><IoMdClose size={20} /></button>
            </div>
            {/* Inputs for employee details */}
            <input type="text" placeholder="Name" value={newEmployee.employeeName} onChange={(e) => setNewEmployee({ ...newEmployee, employeeName: e.target.value })} />
            <input type="text" placeholder="Phone" value={newEmployee.employeePhone} onChange={(e) => setNewEmployee({ ...newEmployee, employeePhone: e.target.value })} />

            {/* Dropdowns for organisation and service */}
            <select value={newEmployee.hospitalName} onChange={(e) => handleHospitalNameChange(e.target.value)}>
              <option value="">Select Organisation</option>
              {/* Create a Set to store unique hospital names */}
              {Array.from(new Set(allClient.map(client => client.hospitalName))).map((hospitalName, index) => (
                <option key={index} value={hospitalName}>{hospitalName}</option>
              ))}
            </select>
            <select value={newEmployee.service} onChange={(e) => setNewEmployee({ ...newEmployee, service: e.target.value })}>
              <option value="">Select Service</option>
              {services.map(service => (
                <option key={service.id} value={service.name}>{service.name}</option>
              ))}
            </select>

            {/* Dropdowns for attendance permission and uniform permission */}
            <select value={newEmployee.attendancePermission} onChange={(e) => setNewEmployee({ ...newEmployee, attendancePermission: e.target.value })}>
              <option value="">Select Attendance Permission</option>
              <option value="YES">YES</option>
              <option value="NO">NO</option>
            </select>
            <select value={newEmployee.uniformPermission} onChange={(e) => setNewEmployee({ ...newEmployee, uniformPermission: e.target.value })}>
              <option value="">Select Uniform Permission</option>
              <option value="YES">YES</option>
              <option value="NO">NO</option>
            </select>

            {/* Save button */}
            <button className="button primary" onClick={handleSaveEmployee}>Save</button>
          </div>
        </div>
      )}



      {showModifyEmployeePopup && selectedEmployee && (
        <div className="popup-container">
          <div className="popup">
            <div>
              {/* <span>{employeeDetail.employeeName}</span> */}
              <h2>Modify Employee</h2>
              <button className="button danger" onClick={handleCloseModifyEmployeePopup}>
                <IoMdClose size={20} />
              </button>
            </div>
            {/* Inputs for modifying employee details */}
            <input
              type="text"
              placeholder="Name"
              value={selectedEmployee.employeeName}
              onChange={(e) => setSelectedEmployee({ ...selectedEmployee, employeeName: e.target.value })}
            />
            <input
              type="text"
              placeholder="Phone"
              value={selectedEmployee.employeePhone}
              onChange={(e) => setSelectedEmployee({ ...selectedEmployee, employeePhone: e.target.value })}
            />
            {/* Dropdowns for modifying organisation and service */}
            <select
              value={selectedEmployee.hospitalName}
              onChange={(e) => setSelectedEmployee({ ...selectedEmployee, hospitalName: e.target.value })}
            >
              <option value="">Select Organisation</option>
              {Array.from(new Set(allClient.map(client => client.hospitalName))).map((hospitalName, index) => (
                <option key={index} value={hospitalName}>{hospitalName}</option>
              ))}
            </select>
            <select
              value={selectedEmployee.service}
              onChange={(e) => setSelectedEmployee({ ...selectedEmployee, service: e.target.value })}
            >
              <option value="">Select Service</option>
              {services.map(service => (
                <option key={service.id} value={service.name}>{service.name}</option>
              ))}
            </select>
            {/* Dropdowns for modifying attendance permission and uniform permission */}
            <select
              value={selectedEmployee.attendancePermission}
              onChange={(e) => setSelectedEmployee({ ...selectedEmployee, attendancePermission: e.target.value })}
            >
              <option value="">Select Attendance Permission</option>
              <option value="YES">YES</option>
              <option value="NO">NO</option>
            </select>
            <select
              value={selectedEmployee.uniformPermission}
              onChange={(e) => setSelectedEmployee({ ...selectedEmployee, uniformPermission: e.target.value })}
            >
              <option value="">Select Uniform Permission</option>
              <option value="YES">YES</option>
              <option value="NO">NO</option>
            </select>
            {/* Save button */}
            <button className="button primary" onClick={handleSaveModifiedEmployee}>Save Changes</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;
