// API URL you provided
const apiUrl = 'https://newsapi.org/v2/everything?q=tesla&from=2025-07-08&sortBy=publishedAt&apiKey=7f0cc8a418064a56b96cd8201018f56c';

// Selects the container where the news will be displayed
const newsContainer = document.getElementById('news-container');

// Function to fetch and display the news
async function fetchNews() {
    try {
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`Request error: ${response.status}`);
        }

        const data = await response.json();
        
        // Checks if the API returned articles
        if (data.articles && data.articles.length > 0) {
            // Iterates over each article and creates an HTML element for it
            data.articles.forEach(article => {
                const articleElement = document.createElement('div');
                articleElement.classList.add('news-article');
                
                articleElement.innerHTML = `
                    <h3><a href="${article.url}" target="_blank">${article.title}</a></h3>
                    <p>${article.description || 'Description not available.'}</p>
                `;
                
                newsContainer.appendChild(articleElement);
            });
        } else {
            newsContainer.innerHTML = '<p>No articles found.</p>';
        }

    } catch (error) {
        console.error('Failed to fetch news:', error);
        newsContainer.innerHTML = `<p>Could not load the news. Please check the API key or the URL. Details: ${error.message}</p>`;
    }
}

// Calls the function to fetch the news when the page loads
fetchNews();