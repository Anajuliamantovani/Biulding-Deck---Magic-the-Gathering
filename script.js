const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3000; 

app.use(express.json());
app.use(cors());

const SCRYFALL_BASE_URL = 'https://api.scryfall.com';

let myFavoriteCards = [
    {
        id: 1,
        nome: 'Jurubebinha',
        custoMana: '{G}{1}{U}',
        tipo: 'Criatura Lendária - Caos estaurado',
        descricao: 'Quando Jurubebinha entra no campo de batalha ela começa virada. Se ela for desvirada no mesmo turno de invocação, ela entra no modo caos ganhando +3/+3',
        danoDefesa: '10/5'
    }
];
let nextId = 2;

app.get('/search-card', async (req, res) => {
    const cardName = req.query.name;

    if (!cardName) {
        return res.status(400).json({ message: 'O parâmetro "name" é obrigatório.' });
    }

    try {
        const response = await axios.get(`${SCRYFALL_BASE_URL}/cards/search`, {
            params: {
                q: cardName
            }
        });

       
        if (response.data && response.data.data && response.data.data.length > 0) {
            const card = response.data.data[0];
            
           
            const cardInfo = {
                scryfallId: card.id,
                name: card.name,
                mana_cost: card.mana_cost,
                type_line: card.type_line,
                oracle_text: card.oracle_text,
                power: card.power || null, 
                toughness: card.toughness || null,
                image_uri: card.image_uris ? card.image_uris.normal : null
            };

            res.json(cardInfo);

        } else {
           
            res.status(404).json({ message: 'Nenhuma carta encontrada com esse nome.' });
        }

    } catch (error) {
        
        if (error.response && error.response.status === 404) {
             res.status(404).json({ message: 'Nenhuma carta encontrada com esse nome.' });
        } else {
            
            console.error('Erro ao buscar na API Scryfall:', error.response ? error.response.data.details : error.message);
            res.status(500).json({ 
                message: 'Erro ao conectar com a API externa.' 
            });
        }
    }
});


app.post('/my-cards', (req, res) => {
    const { nome, custoMana, tipo, descricao, danoDefesa  } = req.body;

    if (!nome || !custoMana || !tipo || !descricao) {
        return res.status(400).json({ message: 'Nome, Custo de mana, tipo e descrição são obrigatórios.' });
    }

    const newCard = {
        id: nextId++,
        nome: nome,
        custoMana: custoMana,
        tipo: tipo,
        descricao: descricao,
        danoDefesa: danoDefesa
    };

    myFavoriteCards.push(newCard);
    res.status(201).json(newCard);
});


app.get('/my-cards', (req, res) => {
    res.json(myFavoriteCards);
});


app.get('/my-cards/:id', (req, res) => {
    const cardId = parseInt(req.params.id);
    const card = myFavoriteCards.find(c => c.id === cardId);

    if (!card) {
        return res.status(404).json({ message: 'Carta não encontrada na sua lista.' });
    }
    res.json(card);
});


app.put('/my-cards/:id', (req, res) => {
    const cardId = parseInt(req.params.id);
    const cardIndex = myFavoriteCards.findIndex(c => c.id === cardId);

    if (cardIndex === -1) {
        return res.status(404).json({ message: 'Carta não encontrada na sua lista.' });
    }

    const updatedCard = { ...myFavoriteCards[cardIndex] };
    
    if (req.body.nome) {
        updatedCard.nome = req.body.nome;
    }
    if (req.body.custoMana) {
        updatedCard.custoMana = req.body.custoMana;
    }
    if (req.body.tipo) {
        updatedCard.tipo = req.body.tipo;
    }
    if (req.body.descricao) {
        updatedCard.descricao = req.body.descricao;
    }
    if (req.body.danoDefesa) {
        updatedCard.danoDefesa = req.body.danoDefesa;
    }

    myFavoriteCards[cardIndex] = updatedCard;
    res.json(updatedCard);
});


app.delete('/my-cards/:id', (req, res) => {
    const cardId = parseInt(req.params.id);
    const cardIndex = myFavoriteCards.findIndex(c => c.id === cardId);

    if (cardIndex === -1) {
        return res.status(404).json({ message: 'Carta não encontrada na sua lista.' });
    }

    myFavoriteCards.splice(cardIndex, 1);

    res.status(204).send();
});


app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
    console.log('API Scryfall configurada para /search-card');
});