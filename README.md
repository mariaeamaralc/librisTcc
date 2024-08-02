User Management System

Este é um sistema de gerenciamento de usuários desenvolvido com Node.js, Express e MySQL. Ele permite a criação, leitura, atualização e exclusão (CRUD) de usuários, com uma interface web para administradores e usuários.
Funcionalidades

    Cadastro e login de usuários
    Listagem de usuários
    Criação, edição e exclusão de usuários
    Diferenciação entre administradores e usuários comuns

Tecnologias Utilizadas

    Node.js: Ambiente de execução para JavaScript no lado do servidor.
    Express: Framework para construção de aplicativos web com Node.js.
    MySQL: Sistema de gerenciamento de banco de dados relacional.
    EJS: Motor de visualização para renderizar páginas HTML.
    Bootstrap: Framework CSS para estilização das páginas.

Instalação
1. Clone o Repositório

sh

git clone https://github.com/username/repository.git
cd repository

2. Instale as Dependências

Certifique-se de que você tem o Node.js e o MySQL instalados. Em seguida, execute o comando para instalar as dependências do projeto:

sh

npm install

3. Configure o Banco de Dados

    Crie um banco de dados no MySQL, por exemplo, user_management.

    No arquivo config/database.js, ajuste as configurações de conexão com o MySQL, como nome do banco de dados, usuário e senha.

javascript

module.exports = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'user_management'
};

    Execute os scripts SQL necessários para criar as tabelas no banco de dados. Normalmente, você pode encontrar esses scripts na pasta db ou similar.

4. Execute o Aplicativo

Inicie o servidor com o comando:

sh

node app.js

O servidor estará disponível em http://localhost:3000.
Estrutura do Projeto

bash

/project-root
│
├── /views
│   ├── /partials
│   │   └── navbar.ejs
│   ├── layout.ejs
│   ├── create.ejs
│   ├── edit.ejs
│   ├── index.ejs
│   ├── show.ejs
│
├── /controllers
│   └── userController.js
│
├── /models
│   └── userModel.js
│
├── /routes
│   └── userRoutes.js
│
├── /config
│   └── database.js
│
├── app.js
├── package.json
└── README.md

Contribuição

Sinta-se à vontade para contribuir com melhorias ou correções. Abra uma issue ou envie um pull request para colaborar com o projeto.
Licença

Este projeto é licenciado sob a MIT License.