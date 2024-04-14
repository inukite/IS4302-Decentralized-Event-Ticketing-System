import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateFilterForMarketplace = ({ onDateSelect, onFilterChange, filter }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const handleDateChange = (date) => {
    setStartDate(date);
    onDateSelect(date);
    setDatePickerVisible(false); // Optionally hide after selection
  };

  const toggleDatePicker = () => {
    setDatePickerVisible(!isDatePickerVisible);
  };

  return (
    <>
      <br />
      <div style={{ marginLeft: '6%' }}>
        {/* Buttons or links to switch between Upcoming and On Sale Now */}
        <button
          style={{
            backgroundColor: filter === 'buy' ? 'darkblue' : '#6F4FF2',
            borderRadius: 10,
            marginRight: 20,
          }}
          onClick={() => onFilterChange('buy')}
        >
          Buy
        </button>
        <button
          style={{
            backgroundColor: filter === 'sell' ? 'darkblue' : '#6F4FF2',
            borderRadius: 10,
            marginRight: 20,
          }}
          onClick={() => onFilterChange('sell')}
        >
          Sell
        </button>

        <button
          style={{
            backgroundColor: '#6F4FF2',
            borderRadius: 10,
            marginRight: 20,
          }}
          onClick={toggleDatePicker}
        >
          Select Dates
        </button>
        {isDatePickerVisible && (
          <DatePicker
            selected={startDate}
            onChange={handleDateChange}
            // inline // Remove this if you want a dropdown date picker
          />
        )}
      </div>
    </>
  );
};

export default DateFilterForMarketplace;
