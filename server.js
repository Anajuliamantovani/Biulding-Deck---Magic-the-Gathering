const API_URL = 'http://localhost:3000';

        // ======================================================
        // FUNÇÕES DA BUSCA NO SCRYFALL
        // ======================================================

        async function searchScryfall() {
            const cardName = document.getElementById('scryfall-name').value;
            const resultDiv = document.getElementById('scryfall-result');
            const errorDiv = document.getElementById('scryfall-error-message');
            
            resultDiv.innerHTML = '<div class="alert alert-info">Buscando...</div>';
            errorDiv.classList.add('d-none'); // Esconde erro

            try {
                const response = await fetch(`${API_URL}/search-card?name=${encodeURIComponent(cardName)}`);
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Carta não encontrada.');
                }
                
                const card = await response.json();
                displayScryfallCard(card);

            } catch (error) {
                console.error('Erro ao buscar no Scryfall:', error);
                resultDiv.innerHTML = ''; // Limpa "Buscando..."
                errorDiv.textContent = `Erro: ${error.message}`;
                errorDiv.classList.remove('d-none'); // Mostra erro
            }
        }

        // ATUALIZADO: Exibe o card usando layout do Bootstrap
        // ATUALIZADO: Adiciona o botão "Adicionar à Coleção"
function displayScryfallCard(card) {
    const resultDiv = document.getElementById('scryfall-result');
    
    let powerToughness = (card.power && card.toughness) ? `<p class="card-text"><strong>P/T:</strong> ${card.power}/${card.toughness}</p>` : '';
    let image = card.image_uri ? 
        `<div class="col-md-4"><img src="${card.image_uri}" alt="${card.name}" class="img-fluid rounded shadow-sm"></div>` : 
        '<div class="col-md-4"><p>(Sem imagem)</p></div>';
    
    // ATENÇÃO: Convertemos o objeto 'card' em uma string JSON para o onclick
    // Usamos encodeURIComponent para escapar caracteres especiais (como aspas)
    const cardDataString = encodeURIComponent(JSON.stringify(card));

    resultDiv.innerHTML = `
        ${image}
        <div class="col-md-8">
            <h3 class="text-primary">${card.name}</h3>
            <p class="card-text"><strong>Custo:</strong> ${card.mana_cost || 'N/A'}</p>
            <p class="card-text"><strong>Tipo:</strong> ${card.type_line}</p>
            <p class="card-text"><strong>Texto:</strong> ${card.oracle_text || 'N/A'}</p>
            ${powerToughness}
            
            <button class="btn btn-primary mt-3" onclick="addScryfallCardToMyCards('${cardDataString}')">
                <i class="bi bi-plus-circle-fill"></i> Adicionar à Coleção
            </button>
        </div>
    `;
}

// ======================================================
// FUNÇÕES DA BUSCA NO SCRYFALL
// ======================================================

// ... (a função searchScryfall está aqui) ...

// ... (a função displayScryfallCard atualizada está aqui) ...


// --- NOVA FUNÇÃO ---
// Pega o card do Scryfall e o salva no nosso CRUD
async function addScryfallCardToMyCards(encodedCardData) {
    try {
        // 1. Decodificar e converter a string de volta para um objeto JSON
        const cardString = decodeURIComponent(encodedCardData);
        const scryfallCard = JSON.parse(cardString);

        // 2. "Traduzir" os dados do Scryfall para o formato do nosso backend
        const myCardData = {
            nome: scryfallCard.name,
            custoMana: scryfallCard.mana_cost || 'N/A',
            tipo: scryfallCard.type_line,
            descricao: scryfallCard.oracle_text || 'Sem descrição.',
            danoDefesa: (scryfallCard.power && scryfallCard.toughness) ? `${scryfallCard.power}/${scryfallCard.toughness}` : null
        };

        // 3. Fazer o POST para a rota /my-cards (igual ao handleSave)
        const response = await fetch(`${API_URL}/my-cards`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(myCardData)
        });

        if (!response.ok) {
            throw new Error('Falha ao salvar a carta na coleção.');
        }

        alert(`"${myCardData.nome}" foi salvo na sua coleção!`);
        
        // 4. Recarregar a lista do CRUD para mostrar o novo card
        loadMyCards();

    } catch (error) {
        console.error('Erro ao adicionar card do Scryfall:', error);
        alert(`Erro: ${error.message}`);
    }
}


        // ======================================================
        // FUNÇÕES DO CRUD (MINHA COLEÇÃO)
        // ======================================================

        // --- READ (Carregar e exibir todas as cartas) ---
        // ATUALIZADO: Gera os cards do Bootstrap
        async function loadMyCards() {
            const listDiv = document.getElementById('my-cards-list');
            listDiv.innerHTML = '<div class="col"><p class="text-info">Carregando cartas salvas...</p></div>';

            try {
                const response = await fetch(`${API_URL}/my-cards`);
                if (!response.ok) {
                    throw new Error('Não foi possível carregar as cartas.');
                }
                
                const cards = await response.json();
                
                listDiv.innerHTML = ''; // Limpa a lista
                
                if (cards.length === 0) {
                    listDiv.innerHTML = '<div class="col"><p class="text-secondary">Nenhuma carta no seu deck ainda.</p></div>';
                    return;
                }

                cards.forEach(card => {
                    const cardElement = document.createElement('div');
                    cardElement.classList.add('col'); // Bootstrap: Coluna dentro do .row
                    
                    const formattedDescription = card.descricao.replace(/\n/g, '<br>');

                    // ATUALIZADO: HTML para o card do Bootstrap
                    cardElement.innerHTML = `
                        <div class="card h-100 bg-dark text-light border-secondary">
                            <div class="card-body">
                                <h5 class="card-title text-primary">${card.nome}</h5>
                                <p class="card-text small mb-1"><strong>Custo:</strong> ${card.custoMana}</p>
                                <p class="card-text small mb-1"><strong>Tipo:</strong> ${card.tipo}</p>
                                <p class="card-text small mb-1"><strong>Descrição:</strong> ${formattedDescription}</p>
                                <p class="card-text small"><strong>P/T:</strong> ${card.danoDefesa || 'N/A'}</p>
                            </div>
                            <div class="card-footer bg-transparent border-top-0 text-end">
                                <button class="btn btn-sm btn-success me-2" onclick="populateFormForEdit(${card.id})"><i class="bi bi-pencil-fill"></i> Editar</button>
                                <button class="btn btn-sm btn-danger" onclick="deleteCard(${card.id})"><i class="bi bi-trash-fill"></i> Excluir</button>
                            </div>
                        </div>
                    `;
                    listDiv.appendChild(cardElement);
                });

            } catch (error) {
                console.error('Erro ao carregar cartas:', error);
                listDiv.innerHTML = `<div class="col"><p class="text-danger">${error.message}</p></div>`;
            }
        }

        // --- CREATE / UPDATE (Decide qual função chamar) ---
        async function handleSave() {
            const cardId = document.getElementById('card-id').value;

            const cardData = {
                nome: document.getElementById('card-nome').value,
                custoMana: document.getElementById('card-custo').value,
                tipo: document.getElementById('card-tipo').value,
                descricao: document.getElementById('card-descricao').value,
                danoDefesa: document.getElementById('card-dano').value || null 
            };
            
            // Validação simples
            if (!cardData.nome || !cardData.custoMana || !cardData.tipo || !cardData.descricao) {
                return;
            }

            try {
                let response;
                if (cardId) {
                    // --- UPDATE (PUT) ---
                    response = await fetch(`${API_URL}/my-cards/${cardId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(cardData)
                    });
                    if (!response.ok) throw new Error('Falha ao atualizar a carta.');

                } else {
                    // --- CREATE (POST) ---
                    response = await fetch(`${API_URL}/my-cards`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(cardData)
                    });
                    if (!response.ok) throw new Error('Falha ao criar a carta.');
                    alert('Carta salva com sucesso!');
                }
                
                clearForm();
                loadMyCards(); // Recarrega a lista

            } catch (error) {
                console.error('Erro ao salvar:', error);
                alert(`Erro: ${error.message}`);
            }
        }

        // --- DELETE ---
        async function deleteCard(id) {
            if (!confirm(`Tem certeza que deseja excluir a carta ID ${id}?`)) {
                return; 
            }

            try {
                const response = await fetch(`${API_URL}/my-cards/${id}`, {
                    method: 'DELETE'
                });

                if (!response.ok && response.status !== 204) {
                    throw new Error('Falha ao excluir a carta.');
                }
                
                alert('Carta excluída com sucesso!');
                loadMyCards(); // Recarrega a lista

            } catch (error) {
                console.error('Erro ao excluir:', error);
                alert(`Erro: ${error.message}`);
            }
        }

        // --- Funções Auxiliares do Formulário ---

        // Preenche o formulário para edição
        async function populateFormForEdit(id) {
        try {
                // 1. Buscar os dados mais recentes do card do NOSSO backend
                const response = await fetch(`${API_URL}/my-cards/${id}`);
                if (!response.ok) {
                    throw new Error('Não foi possível encontrar os dados da carta para editar.');
        }
            const card = await response.json(); // Pega os dados da carta

        // 2. Preencher o formulário (igual a antes)
        document.getElementById('card-id').value = card.id;
        document.getElementById('card-nome').value = card.nome;
        document.getElementById('card-custo').value = card.custoMana;
        document.getElementById('card-tipo').value = card.tipo;
        document.getElementById('card-descricao').value = card.descricao;
        document.getElementById('card-dano').value = card.danoDefesa || '';
        
        // 3. Focar no formulário
        document.getElementById('crud-form').scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error('Erro ao popular formulário:', error);
        alert(`Erro: ${error.message}`);
    }
}

        // Limpa o formulário
        function clearForm() {
            document.getElementById('card-id').value = '';
            document.getElementById('crud-form').reset();
        }

        // Carrega as cartas do CRUD quando a página é aberta
        window.onload = loadMyCards;