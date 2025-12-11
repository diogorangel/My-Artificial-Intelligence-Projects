document.addEventListener('DOMContentLoaded', () => {
    // =================================================================
    // 1. Lógica de Alternância de Tema (Dark/Light Mode)
    // =================================================================
    const htmlElement = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    
    const SUN_ICON = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>';
    const MOON_ICON = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>';

    const applyTheme = (isDark) => {
        if (isDark) {
            htmlElement.classList.add('dark');
            themeIcon.innerHTML = MOON_ICON; 
            themeIcon.setAttribute('title', 'Modo Claro');
        } else {
            htmlElement.classList.remove('dark');
            themeIcon.innerHTML = SUN_ICON; 
            themeIcon.setAttribute('title', 'Modo Escuro');
        }
    };

    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark' || (!currentTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        applyTheme(true);
    } else {
        applyTheme(false);
    }

    themeToggle.addEventListener('click', () => {
        const isDark = htmlElement.classList.contains('dark');
        applyTheme(!isDark);
        localStorage.setItem('theme', !isDark ? 'dark' : 'light');
    });

    // =================================================================
    // 2. Lógica de Geração de Imagem (Simulação de API)
    // =================================================================
    
    const promptInput = document.getElementById('imagePrompt');
    const generateBtn = document.getElementById('generateBtn');
    const loadingDiv = document.getElementById('loading');
    const imageContainer = document.getElementById('imageContainer');
    const generatedImage = document.getElementById('generatedImage');
    const downloadBtn = document.getElementById('downloadBtn');

    // Function to show a custom message box (adapted for this page)
    function showMessage(message, type = 'error') {
        const messageBox = document.getElementById('messageBox');
        const messageText = document.getElementById('messageText');
        messageText.textContent = message;
        
        messageBox.classList.remove('hidden', 'bg-red-100', 'border-red-400', 'text-red-700', 'bg-green-100', 'border-green-400', 'text-green-700', 'dark:bg-red-900', 'dark:border-red-700', 'dark:text-red-300', 'dark:bg-green-900', 'dark:border-green-700', 'dark:text-green-300');
        
        if (type === 'error') {
            messageBox.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'dark:bg-red-900', 'dark:border-red-700', 'dark:text-red-300');
        } else if (type === 'success') {
             messageBox.classList.add('bg-green-100', 'border-green-400', 'text-green-700', 'dark:bg-green-900', 'dark:border-green-700', 'dark:text-green-300');
        }
        
        messageBox.classList.remove('hidden');

        setTimeout(() => {
            messageBox.classList.add('hidden');
        }, 5000);
    }

    generateBtn.addEventListener('click', async () => {
        const imagePrompt = promptInput.value.trim();

        if (imagePrompt.length < 5) {
            showMessage('Por favor, digite uma descrição para a imagem (mínimo 5 caracteres).', 'error');
            return;
        }

        const button = document.getElementById('generateBtn');
        const loading = document.getElementById('loading');

        // Ocultar resultados/mensagens anteriores
        document.getElementById('messageBox').classList.add('hidden');

        // Mostrar estado de loading
        button.classList.add('hidden');
        loading.classList.remove('hidden');
        imageContainer.classList.add('hidden');

        // O prompt de sistema pode ser usado para refinar a descrição da imagem para a API de geração de imagem.
        const systemPrompt = `Você é um gerador de prompts de imagem. Refine a seguinte descrição para criar um prompt artístico e detalhado para uma IA de geração de imagem. Mantenha o idioma original (Português).`;
        let userQuery = `Refinar o prompt para imagem: "${imagePrompt}"`;
        
        try {
            // ATENÇÃO: Insira sua chave de API do Google AI Studio/Gemini aqui.
            const apiKey = "AIzaSyCY9LKFkbjwa0gwFcpqYHvkGvQ8dkHb0RM"; 
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

            const payload = {
                contents: [{ role: "user", parts: [{ text: userQuery }] }],
                config: { systemInstruction: systemPrompt }
            };

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("API Error Response:", errorData);
                throw new Error(`Chamada à API de refinamento falhou com status: ${response.status}`);
            }

            const result = await response.json();
            const refinedPrompt = result?.candidates?.[0]?.content?.parts?.[0]?.text || imagePrompt;
            
            // --- INSERIR CHAMADA À API DE GERAÇÃO DE IMAGEM AQUI ---
            // Como a API de geração de imagem (e.g., Imagen) é diferente, usaremos um placeholder.

            // SIMULAÇÃO: Retorna uma imagem placeholder do Pexels/Picsum
            console.log("Prompt refinado (ou original):", refinedPrompt);
            await new Promise(resolve => setTimeout(resolve, 3000)); // Simula o tempo de geração de imagem

            const imageId = Math.floor(Math.random() * 1000) + 1; // ID aleatório
            const imageUrl = `https://picsum.photos/seed/${imageId}/800/600`;
            // --- FIM DA SIMULAÇÃO ---
            
            // Exibir a imagem gerada
            generatedImage.src = imageUrl;
            generatedImage.alt = refinedPrompt;
            downloadBtn.href = imageUrl; // Para baixar a imagem
            imageContainer.classList.remove('hidden');
            
            showMessage("Imagem gerada com sucesso! (Usando URL simulado)", 'success');

        } catch (error) {
            console.error("Falha na geração da imagem:", error);
            showMessage("Falha na geração da imagem. Verifique a API Key ou o serviço de geração de imagem.", 'error');
        } finally {
            // Ocultar loading e mostrar botão novamente
            loadingDiv.classList.add('hidden');
            button.classList.remove('hidden');
        }
    });
});