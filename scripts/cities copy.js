document.addEventListener('DOMContentLoaded', () => {
    const cityInput = document.getElementById('city-input');
    const searchButton = document.getElementById('button');
    const resultsContainer = document.getElementById('api-results');

    searchButton.addEventListener('click', () => {
        const cityName = cityInput.value.trim();

        if (cityName === '') {
            resultsContainer.innerHTML = '<p>Please enter a city name.</p>';
            return;
        }

        // Clear previous results
        resultsContainer.innerHTML = '<p>Searching...</p>';

        // Build the API URL with the entered city name
        const apiUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=10&language=en&format=json`;

        fetch(apiUrl)
            .then(response => {
                // Check if the response was successful (status code 200)
                if (!response.ok) {
                    throw new Error(`Network error: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                resultsContainer.innerHTML = ''; // Clear the "Searching" message

                if (data.results && data.results.length > 0) {
                    data.results.forEach(city => {
                        // Create a new div element for each result
                        const cityDiv = document.createElement('div');
                        cityDiv.classList.add('p-3', 'mb-3', 'border', 'rounded'); // Basic Bootstrap classes for styling

                        cityDiv.innerHTML = `
                            <h5 class="mb-0"><strong>${city.name}</strong>, ${city.country}</h5>
                            <p class="mb-0"><strong>Latitude:</strong> ${city.latitude} | <strong>Longitude:</strong> ${city.longitude}</p>
                            <p><strong>Timezone:</strong> ${city.timezone}</p>
                        `;
                        resultsContainer.appendChild(cityDiv);
                    });
                } else {
                    resultsContainer.innerHTML = '<p>No city found with this name. Please try again.</p>';
                }
            })
            .catch(error => {
                console.error('Error fetching the API:', error);
                resultsContainer.innerHTML = `<p>An error occurred while fetching the data: ${error.message}</p>`;
            });
    });
});