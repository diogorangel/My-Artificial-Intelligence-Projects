// Substitua 'YOUR_API_KEY' pela sua chave real do APItube
const apiKey = 'api_live_ByNCQrrzil5ooKDdDmyeRAIofxIdPWJL3RlDKTK4'; 

// URL da API do APItube
const apiUrl = `https://api.apitube.io/v1/news/everything?per_page=10`;

// Seleciona o contêiner onde as notícias serão exibidas
const newsContainer = document.getElementById('news-container');

// Função para buscar e exibir as notícias
async function fetchNews() {
    try {
        const response = await fetch(apiUrl, {
            // Adiciona o cabeçalho 'X-API-Key' à requisição
            headers: {
                'X-API-Key': apiKey
            }
        });
        
        if (!response.ok) {
            throw new Error(`Request error: ${response.status}`);
        }

        const data = await response.json();
        
        // Verifica se a API retornou artigos
        if (data.articles && data.articles.length > 0) {
            // Itera sobre cada artigo e cria um elemento HTML para ele
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

// Chama a função para buscar as notícias quando a página carrega
fetchNews();