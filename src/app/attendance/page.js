"use client"

import React, { useState, useContext, useEffect } from 'react';
import './style.css';
import Image from 'next/image';
import { IoMdClose } from "react-icons/io";
import dummyImage from '../../../public/dummy.jpg';
import { DataContext } from '../Data/DataContext';
import CustomDatePicker from '../components/DatePicker';
import TimePicker from '../components/TimePicker';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as XLSX from 'xlsx'

function Page() {

    const { attendanceData, attendanceDetail, allClient, allEmployee, addAttendance, fetchAttendanceData, fetchSpecificAttendanceData, specificAttendenceDetail, fetchSpecificAttendanceDetail, IP_Address
    } = useContext(DataContext)


    const [showAttendanceDetailPopup, setshowAttendanceDetailPopup] = useState(false);
    const [showAddAttendancePopup, setShowAddAttendancePopup] = useState(false);

    const [selectedInDate, setSelectedInDate] = useState(new Date());
    // const [selectedOutDate, setSelectedOutDate] = useState(new Date());
    // const [selectedInTime, setSelectedInTime] = useState('');
    // const [selectedOutTime, setSelectedOutTime] = useState('');
    const [attendanceStatus, setAttendanceStatus] = useState('')
    const [overTime, setOverTime] = useState('')




    const [employeeName, setEmployeeName] = useState('');
    const [employeePhone, setEmployeePhone] = useState('');
    const [employeeDesignation, setEmployeeDesignation] = useState('')
    const [employeeId, setEmployeId] = useState('')

    const [filteredEmployee, setFilteredEmployee] = useState(null);
    const [filterAllEmployee, setAllFilterEmployee] = useState([]);
    const [selectedClient, setSelectedClient] = useState('')
    const [suggestions, setSuggestions] = useState([]);

    const attendanceOptions = [
        'P/2',
        'P',
        'P+P/2',
        'PP',
        'PP+P/2',
        'PPP',

    ];

    const handleSelectedStatus = (event) => {
        setAttendanceStatus(event.target.value)
    }

    const handleEmployeeNameChange = (e) => {
        const name = e.target.value;
        setEmployeeName(name);
        filterSuggestions(name);
    };
    const filterSuggestions = (text) => {
        const filtered = filterAllEmployee.filter(employee => employee.employeeName.toLowerCase().includes(text.toLowerCase()));
        setSuggestions(filtered);
    };


    const handleDownloadExcel = () => {
        const wb = XLSX.utils.book_new();
        const wsData = []; // Array to store table data
    
        // Extract header row
        const headerRow = [];
        document.querySelectorAll('.table thead th').forEach(cell => {
            headerRow.push(cell.textContent.trim());
        });
        wsData.push(headerRow);
    
        // Iterate over table rows
        const rows = document.querySelectorAll('.table tbody tr');
        rows.forEach(row => {
            const rowData = []; // Array to store data for each row
            const cells = row.querySelectorAll('td');
            cells.forEach(cell => {
                // Extract text content of each cell
                rowData.push(cell.textContent.trim());
            });
            // Add row data to wsData array
            wsData.push(rowData);
        });
    
        // Create worksheet from wsData array
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        // Append worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, "AttendanceData");
        // Trigger download of workbook as Excel file
        XLSX.writeFile(wb, "attendance_data.xlsx");
    };


    const handleSuggestionClick = (selectedEmployee) => {
        setEmployeeName(selectedEmployee.employeeName);
        setEmployeePhone(selectedEmployee.employeePhone);
        setEmployeeDesignation(selectedEmployee.service);
        setEmployeId(selectedEmployee._id)
        // console.log(selectedEmployee._id)
        setFilteredEmployee(selectedEmployee);
        // console.log(selectedEmployee)
        setSuggestions([]); // Clear suggestions after selection
    };

    const suggestionList = suggestions.map((employee, index) => (
        <div key={index} onClick={() => handleSuggestionClick(employee)}>{employee.employeeName}</div>
    ));



    const filterEmployeeOnHospital = () => {
        // console.log(all)
        const filtered = allEmployee.filter(employee => employee.hospitalName
            === selectedClient);
        // console.log(filtered)
        setAllFilterEmployee(filtered)
    }

    useEffect(() => {
        // console.log(attendanceDetail)
    }, [attendanceDetail])

    useEffect(() => {
        filterEmployeeOnHospital()
    }, [selectedClient])


    const handleInDateChange = (date) => {
        setSelectedInDate(date);
    };



    const handleAttendanceDetail = async (id) => {
        if (id) {
            try {
                await fetchSpecificAttendanceDetail(id); // Wait for data to be fetched
                setshowAttendanceDetailPopup(true); // Update state to show 
                // console.log(specificAttendenceDetail.employeeDetails.employeeName);
            } catch (error) {
                console.error('Error fetching specific attendance data:', error);
                // Handle error appropriately, e.g., show an error message
            }
        }
    };



    const handleAddAttendance = () => {
        if (selectedClient !== '') {

            setShowAddAttendancePopup(true);
        }
        else {

            alert("Please Select Organization")
        }

    };

    const handleCloseAddClientPopup = () => {
        setshowAttendanceDetailPopup(false);
        setShowAddAttendancePopup(false);
    };


    function formatDate(date) {
        // Function to pad single digit numbers with leading zeros
        const padZero = (num) => {
            return num < 10 ? '0' + num : num;
        };

        // Extract day, month, and year from the date object
        const day = padZero(date.getDate());
        const month = padZero(date.getMonth() + 1);
        const year = date.getFullYear();

        // Return the formatted date string
        return `${day}.${month}.${year}`;
    }

    function formatTime(date) {
        // Function to pad single digit numbers with leading zeros
        const padZero = (num) => {
            return num < 10 ? '0' + num : num;
        };

        // Extract hours, minutes, and seconds from the date object
        const hours = date.getHours();
        const minutes = padZero(date.getMinutes());

        // Determine whether it's AM or PM
        const amOrPm = hours >= 12 ? 'PM' : 'AM';

        // Convert to 12-hour format
        const formattedHours = hours % 12 || 12;

        // Return the formatted time string
        return `${formattedHours}:${minutes} ${amOrPm}`;
    }

    const handleAttendanceSubmission = () => {
        const inDate = formatDate(selectedInDate);

        //  console.log(employeeId, inDate, attendanceStatus, overTime )
        const madeBy = 'admin';

        const data = {
            employeeId,
            checkInTime: inDate,
            attendanceStatus,
            overTime,
            madeBy
        };

        // console.log(formData)
        addAttendance(data)

        // console.log(selectedOutDate, selectedOutTime)
        setEmployeeName('')
        setEmployeId('')
        setSelectedInDate(new Date())


        setEmployeePhone('')
        setEmployeeDesignation('')
        setAttendanceStatus('')
        setOverTime('')
        handleCloseAddClientPopup()
        fetchAttendanceData()
    }


    const handleClientChange = (e) => {
        const client = e.target.value;
        setSelectedClient(client);
    };

    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const handleMonthChange = (date) => {
        setSelectedMonth(date);
    };
    const getDaysInMonth = () => {
        const year = selectedMonth.getFullYear();
        const month = selectedMonth.getMonth() + 1; // JavaScript months are 0-based
        return new Date(year, month, 0).getDate();
    };

    const selectedMonthNumber = selectedMonth.getMonth() + 1;
    const dayNumbers = Array.from({ length: getDaysInMonth() }, (_, i) => i + 1);

    const selectedYear = selectedMonth.getFullYear();


    useEffect(() => {

        console.log(specificAttendenceDetail)
    }, [specificAttendenceDetail])

    const headerRow = (
        <tr>
            <th>S.NO</th>
            <th>EmployeeName</th>
            <th>Designation</th>
            {dayNumbers.map(day => <th key={day}>{day}</th>)}
        </tr>
    );









    const filterOrgaziation = allClient.filter(client => client.hospitalName === selectedClient);


    useEffect(() => {
        // console.log(filterOrgaziation)
    }, [allClient, selectedClient])


    // Generate a row for the selected month
    const row = filterAllEmployee.map((data, index) => {

        const matchingAttendance = attendanceDetail.filter(attendance => attendance.employeeId === data._id);


        // console.log(data)
        // console.log(filterOrgaziation)


        const attendanceStatusArray = dayNumbers.map(day => {
            return ''; // Initialize all days with empty status
        });

        const attendanceIdArray = dayNumbers.map(day => {
            return ''; // Initialize all days with empty IDs
        });




        matchingAttendance.forEach(attendance => {
            // Extract year, month, and day from checkInTime
            // console.log(attendance)
            const checkInDate = attendance.checkInTime;

            // console.log(checkInDate)
            const checkInYear = parseInt(checkInDate.split('.')[2], 10);
            const checkInMonth = parseInt(checkInDate.split('.')[1], 10);
            const checkInDay = parseInt(checkInDate.split('.')[0], 10);





            if (checkInYear === selectedYear && checkInMonth === selectedMonthNumber && dayNumbers.includes(checkInDay)) {
                // Update attendance status for the corresponding day
                const dayIndex = checkInDay - 1; // Adjust day index since arrays are zero-indexed
                attendanceStatusArray[dayIndex] = attendance.attendanceStatus;
                attendanceIdArray[dayIndex] = attendance._id;
            }
        });

        // Generate the row with attendance status for each day
        return (
            <tr key={index}>
                <td>{index + 1}</td>
                <td>{data.employeeName}</td>
                <td>{data.service}</td>
                {attendanceStatusArray.map((status, dayIndex) => (
                    <td key={dayIndex}><button className='attendaceDetailBtn' onClick={() => handleAttendanceDetail(attendanceIdArray[dayIndex])}>{status}</button> </td>
                ))}
            </tr>
        );
    });

    return (
        <div style={{ minHeight: '100vh' }}>
            <div className='attendanceTop'>
                <div>
                    <label htmlFor="months">Select a month: </label>
                    <DatePicker
                        selected={selectedMonth}
                        onChange={handleMonthChange}
                        dateFormat="MMMM yyyy"
                        showMonthYearPicker
                    />
                </div>

                <div>
                    <select onChange={handleClientChange} value={selectedClient}>
                        <option>Select Organization</option>
                        {Array.from(new Set(allClient.map(client => client.hospitalName))).map((hospitalName, index) => (
                            <option key={index} value={hospitalName}>{hospitalName}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <button onClick={handleAddAttendance}>Add Attendance</button>
                </div>
            </div>
            <div className='tableContainer'>
                <table className='table'>
                    <thead>
                        {headerRow}
                    </thead>
                    <tbody>
                        {row}
                    </tbody>
                </table>
            </div>
            <button onClick={handleDownloadExcel}>Download Excel</button>

            {showAttendanceDetailPopup && (
                <div className="popup-container">
                    <div className="popup">
                        <div>
                            <h2>Attendance Detail</h2>
                            <button className="button danger" onClick={handleCloseAddClientPopup}><IoMdClose size={20} /></button>
                        </div>

                        <div className='attDetailBox'>
                            <div>
                                <span>Employee Id:</span>
                                <span>#{specificAttendenceDetail.employeeId}</span>

                            </div>
                            {/* <div>
                                <span>Date :</span>
                                <span>14.12.22</span>

                            </div> */}
                            <div>
                                <span>Made By</span>
                            </div>

                            <div>
                                {specificAttendenceDetail.madeByDetails ? (
                                    <div>
                                        <span>Name</span>
                                        <span>{specificAttendenceDetail.madeByDetails.employeeName}</span>
                                    </div>
                                ):(
                                    <p>Made By Admin</p>
                                )
                            }

                                {specificAttendenceDetail.madeByDetails && (
                                    <div>
                                        <span></span>
                                        <span>Phone</span>
                                        <span>{specificAttendenceDetail.madeByDetails.employeePhone}</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <div>
                                    <span>Name</span>
                                    <span>{specificAttendenceDetail.employeeDetails.employeeName}</span>
                                </div>

                                <div>
                                    <span>Phone Number</span>
                                    <span>{specificAttendenceDetail.employeeDetails.employeePhone}</span>
                                </div>

                                <div>
                                    <span>Organisation</span>
                                    <span>{specificAttendenceDetail.employeeDetails.hospitalName}</span>
                                </div>

                                <div>
                                    <span>Designation</span>
                                    <span>{specificAttendenceDetail.employeeDetails.service}</span>
                                </div>
                            </div>


                        </div>

                        {/* Suggestions list */}




                        {/* <button className="button primary">Save</button> */}
                    </div>
                </div>
            )}


            {showAddAttendancePopup && (
                <div className="popup-container">
                    <div className="popup">
                        <div>
                            <h2>Add Attendance</h2>
                            <button className="button danger" onClick={handleCloseAddClientPopup}><IoMdClose size={20} /></button>
                        </div>

                        <div className='addAttendanceBox'>
                            <div>
                                <input
                                    type="text"
                                    placeholder='Enter Name'
                                    value={employeeName}
                                    onChange={handleEmployeeNameChange}
                                />
                                {/* Suggestions List */}
                                <div className="suggestions">
                                    {suggestionList}
                                </div>
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder='Enter Phone'
                                    value={employeePhone}
                                    disabled // Prevent manual editing
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder='Designation'
                                    value={employeeDesignation}
                                    disabled // Prevent manual editing
                                />
                            </div>
                            <div>
                                <span>In Date:</span>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <CustomDatePicker selectedDate={selectedInDate} onChange={handleInDateChange} />

                                </div>
                            </div>
                            <div>
                                {/* <span>Attendance Status:</span> */}
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <select value={attendanceStatus} onChange={handleSelectedStatus} style={{ marginRight: '10px' }}>
                                        <option value="">Select an option</option>
                                        {attendanceOptions.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>

                                    <input
                                        type="text"
                                        placeholder='Overtime'
                                        value={overTime}
                                        onChange={(e) => setOverTime(e.target.value)}
                                    />
                                </div>
                            </div>
                            {/* Add other fields as required */}
                        </div>

                        <button className="button primary" onClick={handleAttendanceSubmission}>Save</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Page;
