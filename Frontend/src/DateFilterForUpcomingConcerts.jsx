import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateFilterForUpcomingConcerts = ({
  onDateSelect,
  onFilterChange,
  filter,
}) => {
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
            backgroundColor: filter === 'all' ? 'darkblue' : '#6F4FF2',
            borderRadius: 10,
            marginRight: 20,
          }}
          onClick={() => onFilterChange('all')}
        >
          All
        </button>
        <button
          style={{
            backgroundColor: filter === 'upcoming' ? 'darkblue' : '#6F4FF2',
            borderRadius: 10,
            marginRight: 20,
          }}
          onClick={() => onFilterChange('upcoming')}
        >
          Upcoming
        </button>
        <button
          style={{
            backgroundColor: filter === 'onSale' ? 'darkblue' : '#6F4FF2',
            borderRadius: 10,
            marginRight: 20,
          }}
          onClick={() => onFilterChange('onSale')}
        >
          On Sale Now
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

export default DateFilterForUpcomingConcerts;
