# 🪄 Magic: The Gathering - Deck Builder

Um projeto de aplicação web Full-Stack que funciona como um gerenciador de cartas (Deck Builder) de *Magic: The Gathering*. A aplicação consome a API pública do [Scryfall](https://scryfall.com/docs/api) para buscar cartas reais e possui um CRUD local completo em Node.js para que o usuário possa criar e gerenciar sua própria coleção de cartas personalizadas.

Este projeto foi construído com Node.js (Express) no backend e HTML/CSS/Bootstrap 5 no frontend.

## 📸 Demonstração da Interface

A aplicação conta com uma interface moderna de abas, permitindo ao usuário alternar facilmente entre a busca de cartas, a criação de novas cartas e a visualização do seu deck.

<img width="1873" height="928" alt="image" src="https://github.com/user-attachments/assets/600313be-06e7-4058-908f-6bbd30afaf10" />

<img width="1872" height="914" alt="image" src="https://github.com/user-attachments/assets/d65fb95a-2535-42c3-b2c8-edb513981326" />

<img width="1877" height="928" alt="image" src="https://github.com/user-attachments/assets/06779241-99e9-4d19-b01d-4a69fce60376" />

<img width="1877" height="921" alt="image" src="https://github.com/user-attachments/assets/ffe64b94-083e-4169-a8ae-62a70f9a9851" />

## ✨ Funcionalidades Principais

* **Busca na API Externa:** Consome a API do Scryfall para buscar cartas reais de Magic pelo nome.
* **Adicionar à Coleção:** Permite adicionar uma carta encontrada no Scryfall diretamente à sua coleção local.
* **CRUD Completo (Sua Coleção):**
    * **Create:** Crie cartas personalizadas através de um formulário.
    * **Read:** Visualize todas as cartas salvas no seu "deck".
    * **Update:** Edite informações de cartas já existentes.
    * **Delete:** Remova cartas da sua coleção.
* **Interface Reativa:** Frontend construído com Bootstrap 5, usando Abas (Tabs) para separar as funcionalidades e um design responsivo com tema escuro "neon".

## 💻 Tecnologias Utilizadas

### Backend

* **Node.js:** Ambiente de execução do servidor.
* **Express.js:** Framework para gerenciamento de rotas e do servidor HTTP.
* **Axios:** Cliente HTTP para consumir a API do Scryfall.
* **CORS:** Middleware para permitir a comunicação entre o frontend e o backend.
* **Nodemon:** Reinicia o servidor automaticamente.

### Frontend

* **HTML5:** Estrutura da aplicação.
* **CSS3:** Estilização customizada (tema roxo, gradientes, botões neon).
* **Bootstrap 5:** Framework para layout, componentes (Abas, Cards, Formulários) e responsividade.
* **JavaScript (Vanilla):** Manipulação do DOM e requisições `fetch` para o backend local.

---

## 🚀 Como Executar o Projeto

Para rodar este projeto localmente, você precisará do [Node.js](https://nodejs.org/) (versão 16 ou superior) instalado em sua máquina.

1.  **Clone o Repositório**
    ```bash
    git clone https://github.com/Anajuliamantovani/Biulding-Deck---Magic-the-Gathering.git
    ```

2.  **Navegue até a Pasta do Projeto**
    ```bash
    cd [NOME-DO-SEU-REPOSITORIO]
    ```

3.  **Instale as Dependências do Backend**
    ```bash
    npm install
    ```
    *(Este comando instalará o `express`, `axios` e `cors`)*

4.  **Inicie o Servidor Backend**
    ```bash
    npm start
    ```
    *(O servidor estará rodando em `http://localhost:3000`)*

5.  **Abra o Frontend**
    * Não há um passo de "build". Basta abrir o arquivo `index.html` diretamente no seu navegador de preferência.

Pronto! A aplicação estará funcionando, conectando-se automaticamente ao seu backend local.

---

## 🔧 Rotas da API (Backend)

O servidor `index.js` expõe as seguintes rotas (todas em `http://localhost:3000`):

### API Externa (Proxy Scryfall)

* `GET /search-card?name=:cardName`
    * Busca uma carta na API do Scryfall. Retorna o primeiro resultado encontrado.

### API Local (CRUD)

* `GET /my-cards`
    * Lista todas as cartas salvas na coleção local.
* `GET /my-cards/:id`
    * Retorna os dados de uma carta específica da coleção.
* `POST /my-cards`
    * Adiciona uma nova carta à coleção. Requer um *body* em JSON com `nome`, `custoMana`, `tipo` e `descricao`.
* `PUT /my-cards/:id`
    * Atualiza uma carta existente na coleção.
* `DELETE /my-cards/:id`
    * Deleta uma carta da coleção.
