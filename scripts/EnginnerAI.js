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
    // 2. Lógica de Geração de Cenários de Teste (API Gemini)
    // =================================================================

    // Function to show a custom message box (Unified for success/error)
    function showMessage(message, type = 'error') {
        const messageBox = document.getElementById('messageBox');
        const messageText = document.getElementById('messageText');
        messageText.textContent = message;
        
        // Remove todas as classes de cor e oculta
        messageBox.classList.remove('hidden', 'bg-red-100', 'border-red-400', 'text-red-700', 'bg-green-100', 'border-green-400', 'text-green-700', 'dark:bg-red-900', 'dark:border-red-700', 'dark:text-red-300', 'dark:bg-green-900', 'dark:border-green-700', 'dark:text-green-300');
        
        // Adiciona as classes de cor específicas
        if (type === 'error') {
            messageBox.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'dark:bg-red-900', 'dark:border-red-700', 'dark:text-red-300');
        } else if (type === 'success') {
             messageBox.classList.add('bg-green-100', 'border-green-400', 'text-green-700', 'dark:bg-green-900', 'dark:border-green-700', 'dark:text-green-300');
        }
        
        messageBox.classList.remove('hidden');

        // Oculta a mensagem após 5 segundos
        setTimeout(() => {
            messageBox.classList.add('hidden');
        }, 5000);
    }

    document.getElementById('generateBtn').addEventListener('click', async () => {
        const scenarioPrompt = document.getElementById('scenarioPrompt').value.trim();
        const testType = document.getElementById('testType').value;
        const language = document.getElementById('language').value;

        if (scenarioPrompt.length < 5) {
            showMessage('Por favor, digite uma descrição detalhada (mínimo 5 caracteres) para o cenário de teste.', 'error');
            return;
        }

        const button = document.getElementById('generateBtn');
        const loading = document.getElementById('loading');
        const resultsContainer = document.getElementById('resultsContainer');
        const testResult = document.getElementById('testResult');

        // Ocultar resultados/mensagens anteriores
        document.getElementById('messageBox').classList.add('hidden');

        // Mostrar estado de loading
        button.classList.add('hidden');
        loading.classList.remove('hidden');
        resultsContainer.classList.add('hidden');

        const systemPrompt = `Você é um especialista em testes de software. Baseado na descrição fornecida, crie um cenário de teste detalhado. Se o tipo de teste for 'manual', gere os passos em Markdown, usando a estrutura Gherkin (Dado, Quando, Então) se apropriado. Se for 'automatizado', gere o código completo na linguagem e framework especificados. Inclua comentários e organize o código de forma clara.`;

        let userQuery = `Gerar um cenário de teste para o seguinte cenário: "${scenarioPrompt}". Tipo de teste: ${testType}. Linguagem/Formato: ${language}.`;

        try {
            // ATENÇÃO: Insira sua chave de API do Google AI Studio/Gemini aqui.
            const apiKey = "AIzaSyCY9LKFkbjwa0gwFcpqYHvkGvQ8dkHb0RM"; // Sua chave de API deve ser inserida aquiqhttps://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
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
                throw new Error(`Chamada à API falhou com status: ${response.status}`);
            }

            const result = await response.json();
            const generatedText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (generatedText) {
                testResult.textContent = generatedText;
                resultsContainer.classList.remove('hidden');
                showMessage("Cenário de teste gerado com sucesso!", 'success');
            } else {
                throw new Error("Nenhum conteúdo recebido da API. Verifique o prompt ou a resposta da API.");
            }

        } catch (error) {
            console.error("Falha ao gerar cenário de teste:", error);
            // Mensagem de erro unificada
            showMessage("Falha ao gerar o cenário de teste. Por favor, verifique se sua API Key está correta e tente novamente.", 'error');
        } finally {
            // Ocultar loading e mostrar botão novamente
            loading.classList.add('hidden');
            button.classList.remove('hidden');
        }
    });
});