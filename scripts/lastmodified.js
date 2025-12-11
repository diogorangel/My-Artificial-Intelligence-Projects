// Author : Diogo Rangel Dos Santos
// Date   : 2025-07-09

document.addEventListener('DOMContentLoaded', () => {
    // Set current year for copyright
    const copyrightYearSpan = document.getElementById('copyright-year');
    if (copyrightYearSpan) {
        copyrightYearSpan.textContent = new Date().getFullYear();
    }

    // Set last modified date
    const lastModifiedSpan = document.getElementById('last-modified');
    if (lastModifiedSpan) {
        // Format the date as desired (e.g., MM/DD/YYYY HH:MM:SS)
        const lastModifiedDate = new Date(document.lastModified);
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false // Use 24-hour format
        };
        lastModifiedSpan.textContent = lastModifiedDate.toLocaleDateString('en-US', options);
    }

    // Hamburger menu toggle
    const hamburgerBtn = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');

    if (hamburgerBtn && navLinks) {
        hamburgerBtn.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            hamburgerBtn.setAttribute('aria-expanded', navLinks.classList.contains('open'));
        });
    }

    // Dark Mode Toggle (Optional, but included for completeness from header)
    const darkModeToggleBtn = document.querySelector('.dark-mode-toggle button');
    if (darkModeToggleBtn) {
        // Check for saved theme preference
        const currentTheme = localStorage.getItem('theme');
        if (currentTheme === 'dark') {
            document.body.classList.add('dark-mode');
        }

        darkModeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            // Save preference to localStorage
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });
    }
    const weatherDisplay = document.getElementById('weather-display');
    const spotlightDisplay = document.getElementById('spotlight-display');
    const membersDataUrl = 'data/members.json'; // Path to your members JSON

    // --- Weather API Integration ---
    const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY'; // ⚠️ IMPORTANT: Replace with your actual API key
    const city = 'Timbuktu';
    const countryCode = 'ML'; // Mali's country code

    // Weather API URLs (using metric units, change &units=imperial for Fahrenheit)
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=São Paulo,BR&appid={SUA_CHAVE_API}&units=metri`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/weather?q=São Paulo,BR&appid={SUA_CHAVE_API}&units=metri`;

    async function getWeatherData() {
        try {
            const [currentResponse, forecastResponse] = await Promise.all([
                fetch(currentWeatherUrl),
                fetch(forecastUrl)
            ]);

            if (!currentResponse.ok) throw new Error(`Current weather HTTP error! status: ${currentResponse.status}`);
            if (!forecastResponse.ok) throw new Error(`Forecast HTTP error! status: ${forecastResponse.status}`);

            const currentData = await currentResponse.json();
            const forecastData = await forecastResponse.json();

            displayWeather(currentData, forecastData);

        } catch (error) {
            console.error('Error fetching weather data:', error);
            weatherDisplay.innerHTML = '<p>Failed to load weather data. Please try again later.</p>';
        }
    }

    function displayWeather(current, forecast) {
        weatherDisplay.innerHTML = ''; // Clear loading message

        // Current Weather
        const currentWeather = document.createElement('div');
        currentWeather.id = 'current-weather';

        const weatherIcon = document.createElement('img');
        weatherIcon.src = `https://openweathermap.org/img/wn/${current.weather[0].icon}.png`;
        weatherIcon.alt = current.weather[0].description;

        const currentTemp = document.createElement('span');
        currentTemp.id = 'current-temp';
        currentTemp.textContent = `${Math.round(current.main.temp)}°F`; // Use Math.round for cleaner temp

        const currentDesc = document.createElement('p');
        currentDesc.id = 'current-description';
        currentDesc.textContent = current.weather[0].description;

        currentWeather.appendChild(weatherIcon);
        currentWeather.appendChild(currentTemp);
        currentWeather.appendChild(currentDesc);
        weatherDisplay.appendChild(currentWeather);

        // 3-Day Forecast
        const forecastContainer = document.createElement('div');
        forecastContainer.classList.add('forecast-container');

        const dailyForecasts = forecast.list.filter(item => item.dt_txt.includes('12:00:00')); // Get forecast for noon each day
        for (let i = 0; i < Math.min(dailyForecasts.length, 3); i++) { // Limit to 3 days
            const dayData = dailyForecasts[i];
            const forecastDay = document.createElement('div');
            forecastDay.classList.add('forecast-day');

            const date = new Date(dayData.dt * 1000); // Convert timestamp to Date object
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

            const forecastIcon = document.createElement('img');
            forecastIcon.src = `https://openweathermap.org/img/wn/${dayData.weather[0].icon}.png`;
            forecastIcon.alt = dayData.weather[0].description;

            const temp = document.createElement('p');
            temp.classList.add('forecast-temp');
            temp.textContent = `${Math.round(dayData.main.temp)}°F`;

            const description = document.createElement('p');
            description.textContent = dayData.weather[0].description;


            forecastDay.appendChild(document.createElement('h4')).textContent = dayName;
            forecastDay.appendChild(forecastIcon);
            forecastDay.appendChild(temp);
            forecastDay.appendChild(description);
            forecastContainer.appendChild(forecastDay);
        }
        weatherDisplay.appendChild(forecastContainer);
    }

    // --- Business Spotlights ---
    async function loadSpotlights() {
        try {
            const response = await fetch(membersDataUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const members = await response.json();

            // Filter for Gold or Silver members
            const eligibleMembers = members.filter(member =>
                member.membershipLevel === 'Gold' || member.membershipLevel === 'Silver'
            );

            // Shuffle the array
            for (let i = eligibleMembers.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [eligibleMembers[i], eligibleMembers[j]] = [eligibleMembers[j], eligibleMembers[i]];
            }

            // Select 2 or 3 random members
            const spotlightsToShow = Math.min(eligibleMembers.length, Math.floor(Math.random() * 2) + 2); // Randomly 2 or 3
            const selectedSpotlights = eligibleMembers.slice(0, spotlightsToShow);

            spotlightDisplay.innerHTML = ''; // Clear loading message

            if (selectedSpotlights.length === 0) {
                spotlightDisplay.innerHTML = '<p>No eligible members for spotlight at this time.</p>';
                return;
            }

            selectedSpotlights.forEach(member => {
                const card = document.createElement('div');
                card.classList.add('spotlight-card');

                const image = document.createElement('img');
                image.src = `images/${member.image}`;
                image.alt = `${member.name} Logo`;
                image.loading = 'lazy';

                const name = document.createElement('h3');
                name.textContent = member.name;

                const address = document.createElement('p');
                address.textContent = member.address;

                const phone = document.createElement('p');
                phone.textContent = member.phone;

                const website = document.createElement('a');
                website.href = member.website;
                website.textContent = website.href.replace(/(^\w+:|^)\/\//, ''); // Display URL without http/https
                website.target = '_blank';
                website.rel = 'noopener noreferrer';

                const membershipLevel = document.createElement('p');
                membershipLevel.classList.add('membership-level');
                membershipLevel.textContent = `Membership: ${member.membershipLevel}`;

                card.appendChild(image);
                card.appendChild(name);
                card.appendChild(address);
                card.appendChild(phone);
                card.appendChild(website);
                card.appendChild(membershipLevel);

                spotlightDisplay.appendChild(card);
            });

        } catch (error) {
            console.error('Error loading spotlights:', error);
            spotlightDisplay.innerHTML = '<p>Failed to load business spotlights.</p>';
        }
    }

    // Initialize functions
    getWeatherData();
    loadSpotlights();
});