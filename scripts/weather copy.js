document.addEventListener('DOMContentLoaded', () => {
  const searchButton = document.getElementById('search-button');
  const cityInput = document.getElementById('city-input2');
  const apiResults = document.getElementById('api-results2');

  // Add a click event to the search button
  searchButton.addEventListener('click', async () => {
    const cityName = cityInput.value.trim();
    if (cityName) {
      apiResults.innerHTML = '<p>Fetching data...</p>';
      try {
        // Step 1: Convert city name to coordinates using OpenStreetMap Nominatim
        const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?q=${cityName}&format=json&limit=1`);
        const geoData = await geoResponse.json();

        if (geoData && geoData.length > 0) {
          const latitude = geoData[0].lat;
          const longitude = geoData[0].lon;

          // Step 2: Call Open-Meteo API with the coordinates
          const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weather_code&timezone=auto`);
          const weatherData = await weatherResponse.json();

          // Step 3: Display the results
          displayWeatherResults(weatherData, cityName);
        } else {
          apiResults.innerHTML = '<p>City not found. Please try again.</p>';
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        apiResults.innerHTML = '<p>An error occurred while fetching data. Please try again later.</p>';
      }
    }
  });

  // Function to display the forecast results
  function displayWeatherResults(data, cityName) {
    if (data && data.hourly) {
      const now = new Date();
      const currentHourIndex = data.hourly.time.findIndex(time => new Date(time).getHours() === now.getHours());

      if (currentHourIndex !== -1) {
        const temperature = data.hourly.temperature_2m[currentHourIndex];
        const weatherCode = data.hourly.weather_code[currentHourIndex];
        const weatherDescription = getWeatherDescription(weatherCode);

        apiResults.innerHTML = `
          <h3>Weather Forecast for ${cityName}</h3>
          <p><strong>Temperature:</strong> ${temperature}°C</p>
          <p><strong>Condition:</strong> ${weatherDescription}</p>
        `;
      } else {
        apiResults.innerHTML = '<p>Forecast data for the current hour is not available.</p>';
      }
    } else {
      apiResults.innerHTML = '<p>Forecast data is not available.</p>';
    }
  }

  // Function to convert weather code to a description
  function getWeatherDescription(code) {
    const descriptions = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      56: 'Light freezing drizzle',
      57: 'Dense freezing drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      66: 'Light freezing rain',
      67: 'Heavy freezing rain',
      71: 'Slight snow fall',
      73: 'Moderate snow fall',
      75: 'Heavy snow fall',
      77: 'Snow grains',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm: Slight or moderate',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail'
    };
    return descriptions[code] || 'Unknown condition';
  }
});
