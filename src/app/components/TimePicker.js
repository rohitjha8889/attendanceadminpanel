import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


const TimePicker = ({selectedTime, onChange}) => {
   
  
    return (
      <div style={{marginLeft:'10px'}}>
       
        <DatePicker
          selected={selectedTime}
          onChange={onChange}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeCaption="Time"
          dateFormat="h:mm aa"
        />
      </div>
    );
  };
  
  export default TimePicker;