import React, { useEffect, useRef, useState } from 'react';
import './Weather.css';
import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import wind_icon from '../assets/wind.png';
import humidity_icon from '../assets/humidity.png';

const Weather = () => {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(false);
  const [theme, setTheme] = useState('light');
  const [unit, setUnit] = useState('metric');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recentSearches, setRecentSearches] = useState([]); // To track recent searches
  const [inputValue, setInputValue] = useState(''); // To control the input field value

  const allIcons = {
    '01d': clear_icon,
    '01n': clear_icon,
    '02d': cloud_icon,
    '02n': cloud_icon,
    '03d': cloud_icon,
    '03n': cloud_icon,
    '04d': drizzle_icon,
    '04n': drizzle_icon,
    '09d': rain_icon,
    '09n': rain_icon,
    '10d': rain_icon,
    '10n': rain_icon,
    '13d': snow_icon,
    '13n': snow_icon,
  };

  const search = async (city) => {
    if (!city.trim()) {
      alert('Enter a valid City Name');
      return;
    }
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${import.meta.env.VITE_APP_ID}`;
      setLoading(true);
      setError('');
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        setLoading(false);
        alert(data.message);  // Display error message as alert
        return;
      }

      const icon = allIcons[data.weather[0].icon] || clear_icon;
      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: icon,
      });

      // Add city to recent searches if it's not already there
      setRecentSearches((prevSearches) => {
        const newSearches = [data.name, ...prevSearches.filter(city => city !== data.name)];
        if (newSearches.length > 5) {
          newSearches.pop(); // Limit to 5 recent searches
        }
        return newSearches;
      });

      setLoading(false);
    } catch (error) {
      setWeatherData(false);
      setLoading(false);
      console.error('Error in fetching weather data');
    }
  };

  const toggleUnit = () => {
    setUnit((prevUnit) => {
      if (prevUnit === 'metric') {
        return 'imperial'; // Switch to Fahrenheit
      } else {
        return 'metric'; // Switch to Celsius
      }
    });
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    search('London');
  }, [unit]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSearchFromRecent = (city) => {
    search(city);
    setInputValue(city); // Set the input value to the selected city
  };

  return (
    <div className={`weather ${theme}`}>
      <div className="toggle-container">
        <div className="theme-toggle">
          <button onClick={toggleTheme}>
            {theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          </button>
        </div>

        <div className="unit-toggle">
          <button onClick={toggleUnit}>
            {unit === 'metric' ? 'Switch to Fahrenheit' : 'Switch to Celsius'}
          </button>
        </div>
      </div>

      <div className="search-bar">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Search"
        />
        <img src={search_icon} alt="" onClick={() => search(inputValue)} />
      </div>


      {weatherData && (
        <>
          <img src={weatherData.icon} alt="" className="weather-icon" />
          <p className="temperature">{weatherData.temperature}°{unit === 'metric' ? 'C' : 'F'}</p>
          <p className="location">{weatherData.location}</p>
          <div className="weather-data">
            <div className="col">
              <img src={humidity_icon} alt="" />
              <div>
                <p>{weatherData.humidity}</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={wind_icon} alt="" className="small-icon" />
              <div>
                <p>{weatherData.windSpeed}</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Weather;

