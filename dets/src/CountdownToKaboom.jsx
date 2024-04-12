import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ targetDate }) => {
  // Calculate the time left until the target date
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    // Update the time left every second
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Clear the interval on component unmount
    return () => clearTimeout(timer);
  });

  const timerComponents = [];

  // Fill up the timer components array with the time left
  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval]) {
      return;
    }

    timerComponents.push(
      <span key={interval}>
        {timeLeft[interval]}
        {interval.substr(0, 1).toUpperCase()}
      </span>
    );
  });

  return (
    <div style={{ fontWeight: 'bold', textAlign: 'center', fontSize: 30 }}>
      <span>Time Remaining: </span>
      {timerComponents.length ? (
        timerComponents.reduce((acc, elem) => {
          return acc === null ? [elem] : [...acc, ':', elem];
        }, null)
      ) : (
        <span>Time's up!</span>
      )}
    </div>
  );
};

// Usage example: <CountdownTimer targetDate="2024-12-31T23:59:59" />
export default CountdownTimer;
