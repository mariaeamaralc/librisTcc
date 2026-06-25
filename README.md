# 📚 Libris - Sistema de Automatização de Bibliotecas

Este projeto é um **Sistema de Automatização de Bibliotecas** desenvolvido como Trabalho de Conclusão de Curso (TCC) para o curso técnico em Informática para Internet no **IFC (Instituto Federal Catarinense)**. O objetivo do sistema é simplificar o gerenciamento de acervos, o cadastro de usuários e o controle de empréstimos e devoluções de livros.

O projeto foi construído utilizando a arquitetura **MVC (Model-View-Controller)**, garantindo uma estrutura organizada, escalável e de fácil manutenção.

---

## 🚀 Tecnologias Utilizadas

O sistema foi desenvolvido utilizando as seguintes tecnologias e conceitos:

*   **Back-end:** Node.js com o framework Express.
*   **Front-end:** HTML5, CSS3 e JavaScript (renderizados dinamicamente via View Engine, como EJS/Handlebars).
*   **Banco de Dados:** Banco de dados relacional baseado em SQL.
*   **Segurança:** Implementação de autenticação com controle de sessões/rotas privadas utilizando Middlewares e criptografia de senhas.
*   **Arquitetura:** Padrão arquitetural MVC para divisão clara de responsabilidades (Rotas, Controllers, Models e Views).

---

## 📁 Estrutura do Projeto

Baseado no padrão MVC, o repositório está organizado da seguinte forma:

*   `/config`: Configurações de inicialização do sistema e conexões.
*   `/controllers`: Lógica do sistema (validações, controle de empréstimos, etc.).
*   `/middlewares`: Filtros de segurança (como verificação de login e permissões).
*   `/models`: Estrutura de dados e comunicação direta com o banco de dados.
*   `/public`: Arquivos estáticos acessíveis pelo navegador (imagens, estilos CSS e scripts front-end).
*   `/routes`: Definição dos caminhos e endpoints da aplicação.
*   `/views`: Telas e componentes de interface do usuário do sistema.
*   `database.sql`: Script de criação das tabelas do banco de dados.

---

## 🛠️ Como Executar o Projeto

Para rodar o projeto localmente na sua máquina, siga os passos abaixo:

### Pré-requisitos
Antes de começar, você vai precisar ter instalado em sua máquina:
*   [Node.js](https://nodejs.org/)
*   Um gerenciador de banco de dados SQL (como MySQL)

### Passo a Passo

1. **Clone o repositório:**
```bash
   git clone [https://github.com/mariaeamaralc/librisTcc.git]
   cd librisTcc
2. **Instale as dependências:**
   npm install
3. **Inicie o servidor:**
npm start ou node app.js dependendo de como está configurado no package.json
