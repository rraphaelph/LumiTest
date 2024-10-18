# LumiTest

Este é o repositório do projeto **LumiTest**, desenvolvido para extrair dados de faturas de energia elétrica em PDF, armazená-los em um banco de dados PostgreSQL e exibi-los em uma aplicação web.

## Estrutura do Projeto

O projeto está dividido em duas pastas principais:
- **backend/**: Contém a API em Node.js com Express e Prisma.
- **frontend/**: Contém a aplicação web desenvolvida com React.

## Requisitos

- **Node.js** (versão 14 ou superior)
- **PostgreSQL** (versão 10 ou superior)
- **Prisma** (ORM para banco de dados)

## Passos para Rodar a Aplicação Localmente

### 1. Clonar o Repositório

```bash
git clone https://github.com/rraphaelph/LumiTest.git
cd LumiTest
```

### 2. Configurar o Backend

#### 2.1. Instalar as Dependências do Backend

Navegue para a pasta **backend** e instale as dependências:

```bash
cd backend
npm install
```

#### 2.2. Configurar o Banco de Dados

- Crie um banco de dados PostgreSQL.
- Crie um arquivo `.env` na raiz da pasta **backend** com as seguintes variáveis de ambiente:

```env
DATABASE_URL="postgresql://seu-usuario:senha@localhost:5432/nome-do-banco"
PORT=3001
```

#### 2.3. Configurar o Prisma

Depois de configurar o arquivo `.env`, rode as migrações do Prisma para configurar o banco de dados:

```bash
npx prisma migrate dev --name init
```

#### 2.4. Scripts do Backend

O arquivo `package.json` do backend contém os seguintes scripts:

```json
"scripts": {
  "test": "jest",
  "dev": "nodemon",
  "build": "tsup src/index.ts --minify",
  "start": "node dist/index.js"
}
```

- **`npm run test`**: Executa os testes com o Jest.
- **`npm run dev`**: Inicia o servidor de desenvolvimento com o Nodemon.
- **`npm run build`**: Gera o build do projeto com o `tsup`.
- **`npm start`**: Inicia o servidor de produção com o Node.js.

#### 2.5. Iniciar o Backend

Agora, inicie o servidor do backend em modo de desenvolvimento:

```bash
npm run dev
```

O backend será executado em `http://localhost:3001`.

### 3. Configurar o Frontend

#### 3.1. Instalar as Dependências do Frontend

Navegue para a pasta **frontend** e instale as dependências:

```bash
cd ../frontend
npm install
```

#### 3.2. Iniciar o Frontend

Depois de instalar as dependências, inicie o frontend:

```bash
npm start
```

A aplicação web será aberta em `http://localhost:3000`.

## Testes

### Executar Testes no Backend

Para rodar os testes automatizados do backend, vá para a pasta **backend** e execute:

```bash
cd backend
npx jest
```

Os testes irão validar a extração de dados de PDFs, a inserção correta no banco de dados e os cálculos de valores agregados.

## Observações Finais

Este projeto foi desenvolvido como parte do teste prático da Lumi. Ele inclui a extração de dados de PDFs de faturas de energia, uma API com integração ao PostgreSQL e testes automatizados para garantir o funcionamento correto das funcionalidades principais.
