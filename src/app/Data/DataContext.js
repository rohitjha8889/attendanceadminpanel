// dataContext.js
import React, { createContext, useState, useEffect } from 'react';

const DataContext = createContext();

const DataProvider = ({ children }) => {


  const IP_Address = 'http://localhost:5001'
  const [services, setServices] = useState([]);

  useEffect(() => {


    fetchServices();
  }, []);


  //   useEffect(()=>{
  //     console.log(services)
  //   },[services])

  const fetchServices = async () => {
    try {
      const response = await fetch(`${IP_Address}/service/getallservices`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const jsonData = await response.json();
      //   console.log(jsonData);
      setServices(jsonData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  // Client Api

  const [allClient, setAllClient] = useState([]);
  useEffect(() => {
    fetchAllClient()
  }, [])



  const addClient = async (clientData) => {
    try {
      const response = await fetch(`${IP_Address}/client/addclient`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData),
      });

      if (!response.ok) {
        throw new Error('Failed to save client data');
      }

      console.log('Client data saved successfully');
      // Optionally, you can fetch services again after posting client data
      fetchAllClient()
    } catch (error) {
      console.error('Error saving client data:', error);
    }
  };

  const fetchAllClient = async () => {
    try {
      const response = await fetch(`${IP_Address}/client/allclients`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const jsonData = await response.json();
      //   console.log(jsonData);
      setAllClient(jsonData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };


  const deleteClient = async (clientId) => {
    try {
      const response = await fetch(`${IP_Address}/client/deleteclient/${clientId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete client');
      }
      console.log('Client deleted successfully');
      // Fetch updated client list
      fetchAllClient(); // You need to implement this function to fetch updated client list
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };
  // Employe Api


  const [allEmployee, setAllEmployee] = useState([]);
  const [employeeDetail, setEmployeeDetail] = useState()

  useEffect(() => {
    fetchAllEmployee()
  }, [])


  const addEmployee = async (employeeData) => {
    try {
      const response = await fetch(`${IP_Address}/employee/addemployees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      });

      if (!response.ok) {
        throw new Error('Failed to save employeeData data');
      }

      console.log('Employee data saved successfully');
      // Optionally, you can fetch services again after posting client data
      fetchAllEmployee()
    } catch (error) {
      console.error('Error saving Employee data:', error);
    }
  };


  const fetchAllEmployee = async () => {
    try {
      const response = await fetch(`${IP_Address}/employee/allemployees`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const jsonData = await response.json();
      //   console.log(jsonData);
      setAllEmployee(jsonData.reverse())
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };


  const fetchEmployeeDetail = async (employeeId) => {
    try {
      const response = await fetch(`${IP_Address}/employee/employees/${employeeId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const jsonData = await response.json();
      // console.log(jsonData);
      setEmployeeDetail(jsonData)
      return jsonData
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };


  const deleteEmployee = async (clientId) => {
    try {
      const response = await fetch(`${IP_Address}/employee/deleteemployees/${clientId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete client');
      }
      console.log('Client deleted successfully');
      // Fetch updated client list
      fetchAllEmployee() // You need to implement this function to fetch updated client list
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };


  const updateEmployee = async (employeeId, updatedEmployeeData) => {
    try {

      // console.log(employeeId, updatedEmployeeData)
      const response = await fetch(`${IP_Address}/employee/updateemployees/${employeeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEmployeeData),
      });

      if (!response.ok) {
        throw new Error('Failed to update employee data');
      }

      // console.log('Employee data updated successfully');
      // Optionally, you can fetch services again after updating employee data
      fetchAllEmployee();
    } catch (error) {
      console.error('Error updating employee data:', error);
    }
  };

  // Attendance Api
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceDetail, setAttendanceDetail] = useState([])

  // const [specificAttendence, setSpecificAttendence] = useState([]);

  const [specificAttendenceDetail, setSpecificAttendanceDetail] = useState([])


  useEffect(() => {
    fetchAttendanceData();
  }, []);

  useEffect(() => {
    fetchAttendanceDetail()
  }, [attendanceData])

  // useEffect(() => {
  //   if(specificAttendence.employeeId){

  //     fetchSpecificAttendanceDetail()
  //   }
  // }, [specificAttendence])


  const fetchAttendanceData = async () => {
    try {
      const response = await fetch(`${IP_Address}/attendance/allattendance`);
      if (!response.ok) {
        throw new Error('Failed to fetch attendance data');
      }
      const data = await response.json();
      setAttendanceData(data);
    } catch (error) {
      console.error(error);
    }
  };


  const fetchAttendanceDetail = async () => {
    try {
      const updatedAttendance = await Promise.all(
        attendanceData.map(async (item) => {
          try {
            // Fetch employee details for employeeId
            const employeeResponse = await fetch(`${IP_Address}/employee/employees/${item.employeeId}`);
            if (!employeeResponse.ok) {
              throw new Error('Failed to fetch employee details');
            }
            const employeeData = await employeeResponse.json();

            // Fetch employee details for madeBy
            let madeByData = null; // Default value for madeByData
            if (item.madeBy !== 'admin') {
              const madeByResponse = await fetch(`${IP_Address}/employee/employees/${item.madeBy}`);
              if (!madeByResponse.ok) {
                throw new Error('Failed to fetch employee details for madeBy');
              }
              madeByData = await madeByResponse.json(); // Assign value only if not 'admin'
            }

            return { ...item, employeeDetails: employeeData, madeByDetails: madeByData };
          } catch (error) {
            console.error('Error fetching employee data:', error);
            return item; // Keep the original item if fetching fails
          }
        })
      );

      // console.log(updatedAttendance)

      setAttendanceDetail(updatedAttendance);
      return (updatedAttendance)
      // Update state with the updated attendance data
    } catch (error) {
      console.error('Error fetching attendance details:', error);
    }
  };


  const fetchSpecificAttendanceData = async (id) => {
    try {
      const response = await fetch(`${IP_Address}/attendance/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch attendance data');
      }
      const data = await response.json();
      // setSpecificAttendence(data);

      return data
      // console.log(data)
      // fetchSpecificAttendanceDetail();
    } catch (error) {
      console.error(error);
    }
  };


  const fetchSpecificAttendanceDetail = async (id) => {
    try {
      let specificAttendence = await fetchSpecificAttendanceData(id)
      const employeeResponse = await fetch(`${IP_Address}/employee/employees/${specificAttendence.employeeId}`);

      if (!employeeResponse.ok) {
        throw new Error('failed to Fetch employee Detail')
      }

      const employeeData = await employeeResponse.json()
      let madeByData = null; // Default value for madeByData
      if (specificAttendence.madeBy !== 'admin') {
        const madeByResponse = await fetch(`${IP_Address}/employee/employees/${specificAttendence.madeBy}`);
        if (!madeByResponse.ok) {
          throw new Error('Failed to fetch employee details for madeBy');
        }
        madeByData = await madeByResponse.json(); // Assign value only if not 'admin'
      }

      setSpecificAttendanceDetail({...specificAttendence, employeeDetails: employeeData, madeByDetails: madeByData })

      return { ...specificAttendence, employeeDetails: employeeData, madeByDetails: madeByData };
    } catch (error) {
      console.error('Error fetching employee data:', error);
      return null; // Keep the original item if fetching fails
    }
  };


  const addAttendance = async (data) => {
    try {

      console.log(data)
      const response = await fetch(`${IP_Address}/attendance/checkinout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to save Attendance data');
      }

      console.log('Attendance data saved successfully');
      // Optionally, you can fetch services again after posting client data
      // fetchAttendanceData();
      fetchAttendanceDetail()
    } catch (error) {
      console.error('Error saving Employee data:', error);
    }
  };

  return (
    <DataContext.Provider value={{
      IP_Address,
      services,
      fetchServices,

      // Cient api 
      addClient,
      allClient,
      deleteClient,

      // employee Api

      addEmployee,
      allEmployee,
      deleteEmployee,
      fetchEmployeeDetail,
      employeeDetail,
      updateEmployee,


      attendanceData,
      attendanceDetail,
      addAttendance,
      fetchAttendanceData,
      fetchSpecificAttendanceData,
      // specificAttendence,
      specificAttendenceDetail,
      fetchSpecificAttendanceDetail

    }}>
      {children}
    </DataContext.Provider>
  );
};

export { DataContext, DataProvider };
