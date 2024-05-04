// "use client"

// import React, { useState, useContext, useEffect } from 'react';
// import './style.css';
// import Image from 'next/image';
// import { IoMdClose } from "react-icons/io";
// import dummyImage from '../../../public/dummy.jpg';
// import { DataContext } from '../Data/DataContext';
// import CustomDatePicker from '../components/DatePicker';
// import TimePicker from '../components/TimePicker';

// function Page() {

//     const { attendanceData, attendanceDetail, allClient, allEmployee, addAttendance, fetchAttendanceData, fetchSpecificAttendanceData, specificAttendence, specificAttendenceDetail
//     } = useContext(DataContext)


//     const [showAttendanceDetailPopup, setshowAttendanceDetailPopup] = useState(false);
//     const [showAddAttendancePopup, setShowAddAttendancePopup] = useState(false);

//     const [selectedInDate, setSelectedInDate] = useState(new Date());
//     const [selectedOutDate, setSelectedOutDate] = useState(new Date());
//     const [selectedInTime, setSelectedInTime] = useState('');
//     const [selectedOutTime, setSelectedOutTime] = useState('');


//     const [employeeName, setEmployeeName] = useState('');
//     const [employeePhone, setEmployeePhone] = useState('');
//     const [employeeDesignation, setEmployeeDesignation] = useState('')
//     const [employeeId, setEmployeId] = useState('')

//     const [filteredEmployee, setFilteredEmployee] = useState(null);
//     const [filterAllEmployee, setAllFilterEmployee] = useState([]);
//     const [selectedClient, setSelectedClient] = useState('')
//     const [suggestions, setSuggestions] = useState([]);




//     const handleEmployeeNameChange = (e) => {
//         const name = e.target.value;
//         setEmployeeName(name);
//         filterSuggestions(name);
//     };
//     const filterSuggestions = (text) => {
//         const filtered = filterAllEmployee.filter(employee => employee.employeeName.toLowerCase().includes(text.toLowerCase()));
//         setSuggestions(filtered);
//     };

//     const handleSuggestionClick = (selectedEmployee) => {
//         setEmployeeName(selectedEmployee.employeeName);
//         setEmployeePhone(selectedEmployee.employeePhone);
//         setEmployeeDesignation(selectedEmployee.service);
//         setEmployeId(selectedEmployee._id)
//         // console.log(selectedEmployee._id)
//         setFilteredEmployee(selectedEmployee);
//         // console.log(selectedEmployee)
//         setSuggestions([]); // Clear suggestions after selection
//     };

//     const suggestionList = suggestions.map((employee, index) => (
//         <div key={index} onClick={() => handleSuggestionClick(employee)}>{employee.employeeName}</div>
//     ));



//     const filterEmployeeOnHospital = () => {
//         // console.log(all)
//         const filtered = allEmployee.filter(employee => employee.hospitalName
//             === selectedClient);
//         // console.log(filtered)
//         setAllFilterEmployee(filtered)
//     }

//     useEffect(() => {
//         // console.log(attendanceDetail)
//     }, [attendanceDetail])

//     useEffect(() => {
//         filterEmployeeOnHospital()
//     }, [selectedClient])


//     const handleInDateChange = (date) => {
//         setSelectedInDate(date);
//     };
//     const handleOutDateChange = (date) => {
//         setSelectedOutDate(date);
//     };

//     const handleInTimeChange = (time) => {
//         setSelectedInTime(time);
//         //    console.log(selectedTime)
//     };
//     const handleOutTimeChange = (time) => {
//         setSelectedOutTime(time);
//         //    console.log(selectedTime)
//     };
//     const months = [
//         { name: 'January', days: 31 },
//         { name: 'February', days: 29 },
//         { name: 'March', days: 31 },
//         { name: 'April', days: 30 },
//         { name: 'May', days: 31 },
//         { name: 'June', days: 30 },
//         { name: 'July', days: 31 },
//         { name: 'August', days: 31 },
//         { name: 'September', days: 30 },
//         { name: 'October', days: 31 },
//         { name: 'November', days: 30 },
//         { name: 'December', days: 31 }
//     ];

//     const handleAttendanceDetail = (id) => {
//         if (id) {
//             setshowAttendanceDetailPopup(true);
//             // console.log(id);

//             fetchSpecificAttendanceData(id)

            
//         }
//     };

//     const handleAddAttendance = () => {
//         setShowAddAttendancePopup(true);
//     };

//     const handleCloseAddClientPopup = () => {
//         setshowAttendanceDetailPopup(false);
//         setShowAddAttendancePopup(false);
//     };


//     function formatDate(date) {
//         // Function to pad single digit numbers with leading zeros
//         const padZero = (num) => {
//             return num < 10 ? '0' + num : num;
//         };

//         // Extract day, month, and year from the date object
//         const day = padZero(date.getDate());
//         const month = padZero(date.getMonth() + 1);
//         const year = date.getFullYear();

//         // Return the formatted date string
//         return `${day}.${month}.${year}`;
//     }

//     function formatTime(date) {
//         // Function to pad single digit numbers with leading zeros
//         const padZero = (num) => {
//             return num < 10 ? '0' + num : num;
//         };

//         // Extract hours, minutes, and seconds from the date object
//         const hours = date.getHours();
//         const minutes = padZero(date.getMinutes());

//         // Determine whether it's AM or PM
//         const amOrPm = hours >= 12 ? 'PM' : 'AM';

//         // Convert to 12-hour format
//         const formattedHours = hours % 12 || 12;

//         // Return the formatted time string
//         return `${formattedHours}:${minutes} ${amOrPm}`;
//     }

//     const handleAttendanceSubmission = () => {
//         const inDate = formatDate(selectedInDate);
//         const inTime = formatTime(selectedInTime);
//         const outDate = formatDate(selectedOutDate);
//         const outTime = formatTime(selectedOutTime);


//         const formData = new FormData();
//         formData.append('employeeId', employeeId); // Assuming employeeId is available
//         formData.append('checkInTime', `${inDate} ${inTime}`);
//         formData.append('checkOutTime', `${outDate} ${outTime}`);
//         formData.append('madeBy', 'admin')

//         // console.log(formData)
//         addAttendance(formData)

//         // console.log(selectedOutDate, selectedOutTime)
//         setEmployeeName('')
//         setEmployeId('')
//         setSelectedInDate(new Date())
//         setSelectedInTime('')
//         setSelectedOutDate(new Date())
//         setSelectedOutTime('')

//         setEmployeePhone('')
//         setEmployeeDesignation('')
//         handleCloseAddClientPopup()
//         fetchAttendanceData()
//     }


//     const handleClientChange = (e) => {
//         const client = e.target.value;
//         setSelectedClient(client);
//     };

  



//     const [selectedMonth, setSelectedMonth] = useState(months[0].name);

   
//     const selectedMonthObj = months.find(month => month.name === selectedMonth);

    
//     const dayNumbers = Array.from({ length: selectedMonthObj.days }, (_, i) => i + 1);

    
//     const headerRow = (
//         <tr>
//             <th>S.NO</th>
//             <th>EmployeeName</th>
//             <th>Designation</th>
//             {dayNumbers.map(day => <th key={day}>{day}</th>)}
//         </tr>
//     );
//     const selectedMonthNumber = months.findIndex(month => month.name === selectedMonth) + 1;



//     // Generate a row for the selected month
//     const row = filterAllEmployee.map((data, index) => {
//         // Check if there's any matching attendance for the current employee
//         const matchingAttendance = attendanceDetail.filter(attendance => attendance.employeeId === data._id);

//         // console.log(attendanceDetail)
    
//         // Initialize an array to hold attendance status for each day
//         const attendanceStatusArray = dayNumbers.map(day => {
//             return ''; // Initialize all days with empty status
//         });

//         const attendanceIdArray = dayNumbers.map(day => {
//             return ''; // Initialize all days with empty IDs
//         });
    
    
//         matchingAttendance.forEach(attendance => {
//             // Extract month and day from checkInTime
//             // console.log(attendance._id)
//             const checkInDate = attendance.checkInTime;
//             const checkInMonth = parseInt(checkInDate.split('.')[1], 10);
//             const checkInDay = parseInt(checkInDate.split('.')[0], 10);
    
//             // Check if the attendance is for the selected month
//             if (checkInMonth === selectedMonthNumber && dayNumbers.includes(checkInDay)) {
//                 // Update attendance status for the corresponding day
//                 const dayIndex = checkInDay - 1; // Adjust day index since arrays are zero-indexed
//                 attendanceStatusArray[dayIndex] = 'P';
//                 attendanceIdArray[dayIndex] = attendance._id;
//             }
//         });
    
//         // Generate the row with attendance status for each day
//         return (
//             <tr key={index}>
//                 <td>{index + 1}</td>
//                 <td>{data.employeeName}</td>
//                 <td>{data.service}</td>
//                 {attendanceStatusArray.map((status, dayIndex) => (
//                     <td key={dayIndex}><button className='attendaceDetailBtn' onClick={() => handleAttendanceDetail(attendanceIdArray[dayIndex])}>{status}</button> </td>
//                 ))}
//             </tr>
//         );
//     });
    
//     return (
//         <div style={{ minHeight: '100vh' }}>
//             <div className='attendanceTop'>
//                 <div>
//                     <label htmlFor="months">Select a month: </label>
//                     <select id="months" onChange={(e) => setSelectedMonth(e.target.value)} value={selectedMonth}>
//                         {months.map(month => (
//                             <option key={month.name} value={month.name}>{month.name}</option>
//                         ))}
//                     </select>
//                 </div>

//                 <div>
//                     <select onChange={handleClientChange} value={selectedClient}>
//                         <option>Select Organization</option>
//                         {Array.from(new Set(allClient.map(client => client.hospitalName))).map((hospitalName, index) => (
//                             <option key={index} value={hospitalName}>{hospitalName}</option>
//                         ))}
//                     </select>
//                 </div>
//                 <div>
//                     <button onClick={handleAddAttendance}>Add Attendance</button>
//                 </div>
//             </div>
//             <div className='tableContainer'>
//                 <table className='table'>
//                     <thead>
//                         {headerRow}
//                     </thead>
//                     <tbody>
//                         {row}
//                     </tbody>
//                 </table>
//             </div>

//             {showAttendanceDetailPopup && (
//                 <div className="popup-container">
//                     <div className="popup">
//                         <div>
//                             <h2>Attendance Detail</h2>
//                             <button className="button danger" onClick={handleCloseAddClientPopup}><IoMdClose size={20} /></button>
//                         </div>

//                         <div className='attDetailBox'>
//                             <div>
//                                 <span>Employee Id:</span>
//                                 <span>#852254254542</span>

//                             </div>
//                             <div>
//                                 <span>Date :</span>
//                                 <span>14.12.22</span>

//                             </div>

//                             <div>
//                                 <div>
//                                     <Image src={dummyImage} width={100} height={100} alt='inImage'/>
//                                     <span>InTime</span>
//                                     <span>8:12 AM</span>
//                                 </div>
//                                 <div>
//                                     <Image src={dummyImage} width={100} height={100} alt='outImage'/>
//                                     <span>outTime</span>
//                                     <span>8:12 AM</span>
//                                 </div>
//                             </div>

//                             <div>
//                                 <div>
//                                     <span>Name</span>
//                                     <span>Sunny Kumar</span>
//                                 </div>

//                                 <div>
//                                     <span>Phone Number</span>
//                                     <span>7896455245</span>
//                                 </div>

//                                 <div>
//                                     <span>Organisation</span>
//                                     <span>Sunrise</span>
//                                 </div>

//                                 <div>
//                                     <span>Designation</span>
//                                     <span>GDA</span>
//                                 </div>
//                             </div>


//                         </div>

//                         {/* Suggestions list */}




//                         {/* <button className="button primary">Save</button> */}
//                     </div>
//                 </div>
//             )}


//             {showAddAttendancePopup && (
//                 <div className="popup-container">
//                     <div className="popup">
//                         <div>
//                             <h2>Add Attendance</h2>
//                             <button className="button danger" onClick={handleCloseAddClientPopup}><IoMdClose size={20} /></button>
//                         </div>

//                         <div className='addAttendanceBox'>
//                             <div>
//                                 <input
//                                     type="text"
//                                     placeholder='Enter Name'
//                                     value={employeeName}
//                                     onChange={handleEmployeeNameChange}
//                                 />
//                                 {/* Suggestions List */}
//                                 <div className="suggestions">
//                                     {suggestionList}
//                                 </div>
//                             </div>
//                             <div>
//                                 <input
//                                     type="text"
//                                     placeholder='Enter Phone'
//                                     value={employeePhone}
//                                     disabled // Prevent manual editing
//                                 />
//                             </div>
//                             <div>
//                                 <input
//                                     type="text"
//                                     placeholder='Designation'
//                                     value={employeeDesignation}
//                                     disabled // Prevent manual editing
//                                 />
//                             </div>
//                             <div>
//                                 <span>In Date & Time:</span>
//                                 <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                                     <CustomDatePicker selectedDate={selectedInDate} onChange={handleInDateChange} />
//                                     <TimePicker selectedTime={selectedInTime} className='timePicker' onChange={handleInTimeChange} />
//                                 </div>
//                             </div>
//                             <div>
//                                 <span>Out Date & Time:</span>
//                                 <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                                     <CustomDatePicker selectedDate={selectedOutDate} onChange={handleOutDateChange} />
//                                     <TimePicker selectedTime={selectedOutTime} className='timePicker' onChange={handleOutTimeChange} />
//                                 </div>
//                             </div>
//                             {/* Add other fields as required */}
//                         </div>

//                         <button className="button primary" onClick={handleAttendanceSubmission}>Save</button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default Page;
