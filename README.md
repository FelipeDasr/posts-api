# Posts API

<div align="center"></br>
  <img alt="API badge" src="https://img.shields.io/badge/API%20REST-E64D80?style=for-the-badge" />
  <img alt="NodeJS badge" src="https://img.shields.io/badge/Node.js-90C53F?style=for-the-badge&logo=node.js&logoColor=white"/>
  <img alt="ExpressJS badge" src="https://img.shields.io/badge/Express.js-333331?style=for-the-badge" />
  <img alt="JWT badge" src="https://img.shields.io/badge/JWT-333331?style=for-the-badge&" />
  <img alt="Sequelize badge" src="https://img.shields.io/badge/Sequelize-00B1EA?style=for-the-badge&logo=sequelize&logoColor=white" />
</div></br>

Api desenvolvida com o objetivo de criar novos usuários, além de armazenar, consultar, excluir e modificar seus posts.

A aplicação foi desenvolvida utilizando NodeJS, com o framework ExpressJS. O ORM escolhido foi o Sequelize que, além de ter uma fácil integração, exige um mínimo esforço para fazer a troca para outro banco de dados, caso seja necessário. Já falando em banco de dados, a aplicação usa o PostgreSQL, por ser de fácil utlização, e robusto bd.

Todas as ações presentes na API, exigem autenticação, que é feita com um token JWT, passado para o usuário quando ele faz o signin, o token tem válidade de 24hr (1 dia).
</br>

### Posts endpoints

- **Autenticação**
  - [**Criar conta**](#criar-conta)
  - [**Autenticação**](#autenticação)
</br>

- **Manipulação**
  - [**Novo post**](#criar-novo-post)
  - [**Atualizar**](#atualizar-post)
  - [**Excluir**](#excluir-post)
</br>

- **Consultas**
  - [**Pesquisar**](#pesquisar-posts)
  - [**Posts de um usuário**](#posts-de-um-usuário)
  - [**Específicas**](#post-específico)
</br>

- **Erros comuns**
  - [**Missing fields**](#missing-fields)
  - [**Invalid id**](#invalid-id)
</br>

---

# Iniciando

Saída no console se tudo estiver certo ao iniciar a `API REST`.

    API IS RUNNING AT: http://127.0.0.1:3000
    DATABASE OK

**`URL BASE:`** **`http://127.0.0.1:3000`**

---

# Criar conta

| URL           | Método     | Autenticação requerida |
|---------------|------------|------------------------|
| **`/signup`** | **`POST`** | **`NÃO`**              |

**Parâmetros obrigatórios:**

| Campo           | Tipo         | In   | Descrição                |
|-----------------|--------------|------|--------------------------|
| **`firstName`** | **`string`** | body | Primeiro nome do usuário |
| **`lastName`**  | **`string`** | body | Sobrenome do usuário     |
| **`email`**     | **`string`** | body | E-mail da conta          |
| **`password`**  | **`string`** | body | Senha da conta           |

**Examplo do body**

```json
{
	"firstName": "Felipe",
	"lastName": "Dos Anjos",
	"email": "felipe@email.com",
	"password": "password_123"
}
```

### Resposta de sucesso

**Motivo:** Usuário criado com sucesso.

**Código:** **`201 CREATED`**

```json
{
  "msg": "User created successfully",
  "error": false
}
```

### Respostas de erros

**Motivo:** O email enviado, já está cadastrado.

**Código:** **`422 UNPROCESSABLE ENTITY`**

```json
{
  "msg": "Email is already registered",
  "error": true
}
```

---

# Autenticação

| URL           | Método    | Autenticação requerida |
|---------------|-----------|------------------------|
| **`/signin`** | **`POST`** | **`NÃO`**              |

**Parâmetros obrigatórios:**

| Campo          | Tipo         | In   | Descrição       |
|----------------|--------------|------|-----------------|
| **`email`**    | **`string`** | body | E-mail da conta |
| **`password`** | **`string`** | body | Senha da conta  |

**Exemplo do body**

```json
{
	"email": "felipe@email.com",
	"password": "password_123"
}
```

## Resposta de sucesso

**Motivo:** E-mail e senha corretos.

**Código:** **`200 OK`**

```json
{
  "msg": "Successful signin",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjNkY2NmZjMwLTM0ODItNGM5MS1hOWM1LTFjNWQzOTZlNTcxZSIsImlhdCI6MTYzNzI3NDUwMCwiZXhwIjoxNjM3MzYwOTAwfQ.cn7e6sFmO47C-Yv0Pa6_LPmROzTT17o8NuGO3_myZ3Q",
  "error": false
}
```
Após receber o `token`, você deverá inseri-lo dentro de todas as requisições que exigem autenticação, dentro do **header** **`Authorization`**, como um `Bearer <token>`. Ex:

	header.Authorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjNkY2NmZj...'

## Respostas de erros

**Motivo:** E-mail ou senha está incorreto.

**Código:** **`401 UNAUTHORIZED`**

```json
{
  "msg": "Email or Password is incorrect",
  "error": true
}
```

---

# Criar novo post

| URL         | Método     | Autenticação requerida |
|-------------|------------|------------------------|
| **`/post`** | **`POST`** | **`SIM`**              |

**Parâmetros obrigatórios:**

| Campo         | Tipo         | In   | Descrição                   |
|---------------|--------------|------|-----------------------------|
| **`title`**   | **`string`** | body | Título da nova publicação   |
| **`content`** | **`string`** | body | Conteúdo da nova publicação |

**Exemplo do body**

```json
{
	"title": "Meu primeiro post",
	"content": "Esse é o conteúdo do meu primeiro post. Obrigado."
}
```

## Resposta de sucesso

**Motivo:** Post enviado, e criado com sucesso.

**Código:** **`201 CREATED`**

```json
{
  "msg": "Post created successfully",
  "error": false
}
```

---

# Pesquisar posts

| URL         | Método    | Autenticação requerida |
|-------------|-----------|------------------------|
| **`/post`** | **`GET`** | **`SIM`**              |

**Parâmetros:**

| Campo        | Tipo         | In    | Requerido | Default   | Descrição                                 |
|--------------|--------------|-------|-----------|-----------|-------------------------------------------|
| **`search`** | **`string`** | query | **`NÃO`** |           | Campo de pesquisa, para retornar os posts |
| **`limit`**  | **`int`**    | query | **`NÃO`** | **`100`** | Número máximo de dados retornados         |
| **`page`**   | **`int`**    | query | **`NÃO`** | **`0`**   | Páginação dos dados                       |

**Exemplo de requisição**

**`GET`** **`/post?limit={Limit}&page={page}&search={SearchQuery}`**

**`GET`** **`/post?limit=3&page=0&search=JavaScript`**

## Resposta de sucesso

**Motivo:** A requisição foi enviada com sucesso, e os dados foram retornados.

**Código:** **`200 OK`**

```json
{
  "rows": [
    {
      "id": "52262e44-8768-4167-b9d0-b2461b18bca7",
      "title": "JavaScript: Sintaxe e tipos",
      "content": "Este capítulo trata sobre a sintaxe básica do JavaScript, declarações de variáveis, tipos de dados e literais...",
      "createdAt": "2021-11-19T00:41:10.779Z",
      "updatedAt": "2021-11-19T00:41:10.780Z",
      "User": {
        "id": "0a51cf9f-50f8-46bb-995d-60a7bdd32a07",
        "firstName": "Emilly",
        "lastName": "Clarke"
      }
    },
    {
      "id": "a8cb8854-d3e7-42f9-80a9-597da741fb99",
      "title": "O que é JavaScript",
      "content": "O JS ou JavaScript é uma linguagem de programação de alto-nível, criada no meio da década de 90...",
      "createdAt": "2021-11-19T00:36:24.615Z",
      "updatedAt": "2021-11-19T00:36:24.616Z",
      "User": {
        "id": "3dccff30-3482-4c91-a9c5-1c5d396e571e",
        "firstName": "Felipe",
        "lastName": "Dos Anjos"
      }
    },
    {
      "id": "291f100a-5afe-4e8a-88e6-0e33db0089ab",
      "title": "Vantagens de usar JavaScript",
      "content": "Extremamente versátil, o JavaScript pode até ter começado de forma tímida com foco limitado ao client-side...",
      "createdAt": "2021-11-19T00:34:21.504Z",
      "updatedAt": "2021-11-19T00:34:21.505Z",
      "User": {
        "id": "e5dacf55-636a-43c8-aabf-63559be575ff",
        "firstName": "Matthew",
        "lastName": "Rossi"
      }
    }
  ],
  "totalRecords": 3424,
  "records": 3,
  "error": false
}
```

## Resposta vazias

**Motivo:** Caso nenhum conteúdo for encontrado de acordo com sua query, o retorno será vazio.

**Código:** **`200 OK`**

```json
{
  "rows": [],
  "totalRecords": 0,
  "records": 0,
  "error": false
}
```

---

# Posts de um usuário

| URL                       | Método    | Autenticação requerida |
|---------------------------|-----------|------------------------|
| **`/user/:userId/posts`** | **`GET`** | **`SIM`**              |

**Parâmetros:**

| Campo         | Tipo       | In       | Requerido | Default | Descrição                         |
|---------------|------------|----------|-----------|---------|-----------------------------------|
| **`:userId`** | **`UUID`** | URL path | **`SIM`** |         | Id do alvo da pesquisa            |
| **`limit`**   | **`int`**  | query    | **`NÃO`** | 100     | Número máximo de dados retornados |
| **`page`**    | **`int`**  | query    | **`NÃO`** | 0       | Páginação dos dados               |

**Exemplo de requisição**

**`GET`** **`/user/:userId/posts?limit={limit}&page={page}`**

**`GET`** **`/user/dfdc5160-1034-413a-83ba-9862ada985e8/posts?limit=3&page=0`**

## Resposta de sucesso

**Motivo:** A requisição foi enviada com sucesso, e os dados foram retornados.

**Código:** **`200 OK`**

```json
{
  "user": {
    "id": "dfdc5160-1034-413a-83ba-9862ada985e8",
    "firstName": "Felipe",
    "lastName": "Dos Anjos"
  },
  "posts": {
    "rows": [
      {
        "id": "a8cb8854-d3e7-42f9-80a9-597da741fb99",
        "title": "O que é JavaScript",
        "content": "O JS ou JavaScript é uma linguagem de programação de alto-nível, criada no meio da década de 90...",
        "createdAt": "2021-11-19T00:36:24.615Z",
        "updatedAt": "2021-11-19T00:36:24.616Z",
      },
      {
        "id": "a1b118ec-dcc8-44d3-85c3-e273c5787cf1",
        "title": "Markdowns: introdução",
        "content": "Desenvolvido em 2004 por John Gruber e Aaron Swartz para simplificar a estruturação de um texto...",
        "createdAt": "2021-11-18T01:20:35.588Z",
        "updatedAt": "2021-11-18T01:20:35.589Z"
      },
      {
        "id": "90443455-6e8a-4eca-917c-0f7878db691a",
        "title": "O que é GitHub, e qual sua função?",
        "content": "O GitHub é um site que abriga um software de controle de versão de desenvolvimento através do sistema Git...",
        "createdAt": "2021-11-16T23:17:14.880Z",
        "updatedAt": "2021-11-16T23:17:14.880Z"
      }
    ],
    "totalRecords": 37,
    "records": 3
  },
  "error": false
}
```

## Resposta vazias

**Motivo:** Caso o usuário não possua nenhum post, o `posts.rows` será vazio.

**Código:** **`200 OK`**

```json
{
  "user": {
    "id": "dfdc5160-1034-413a-83ba-9862ada985e8",
    "firstName": "Felipe",
    "lastName": "Dos Anjos"
  },
  "posts": {
    "rows": [],
    "totalRecords": 0,
    "records": 0
  },
  "error": false
}
```

## Respostas de erros

**Motivo:** Caso o id do `usuário` requisitado seja inexistente.

**Código:** **`400 BAD REQUEST`**

```json
{
  "msg": "User doesn't exist",
  "error": true
}
```

---

# Post específico

| URL                 | Método    | Autenticação requerida |
|---------------------|-----------|------------------------|
| **`/post/:postId`** | **`GET`** | **`SIM`**              |

**Parâmetro obrigatório**

| Campo         | tipo       | In       |
|---------------|------------|----------|
| **`:postId`** | **`UUID`** | URL path |

**Exemplo de requisição**

**`GET`** **`/post/:postId`**

**`GET`** **`/post/a8cb8854-d3e7-42f9-80a9-597da741fb99`**

## Resposta de sucesso

**Motivo:** A requisição foi enviada com sucesso, e os dados foram retornados.

**Código:** **`200 OK`**

```json
{
  "user": {
    "id": "3dccff30-3482-4c91-a9c5-1c5d396e571e",
    "firstName": "Felipe",
    "lastName": "Dasr"
  },
  "id": "a8cb8854-d3e7-42f9-80a9-597da741fb99",
  "title": "O que é JavaScript",
  "content": "O JS ou JavaScript é uma linguagem de programação de alto-nível, criada no meio da década de 90.....",
  "createdAt": "2021-11-19T00:36:24.615Z",
  "updatedAt": "2021-11-19T00:36:24.616Z",
  "error": false
}
```

## Resposta vazia


**Motivo:** Caso o id do `post` requisitado seja inexistente.

**Código:** **`200 OK`**

```json
{ }
```

---

# Atualizar Post

Somente o **`autor`** do `post` poderá atualiza-lo.

| URL                       | Método    | Autenticação requerida |
|---------------------------|-----------|------------------------|
| **`/updade/post/:postId`** | **`PATCH`** | **`SIM`**              |

**Parâmetros:**

| Campo         | Tipo       | In       |Requerido|Descrição|
|---------------|------------|----------|-|-|
| **`:postId`** | **`UUID`** | URL path |**`SIM`**|Id do post|
|**`title`**|**`string`**|body|**`NÃO`**|Título atualizado|
|**`content`**|**`string`**|body|**`NÃO`**|Conteudo atualizado|

**`OBS`**: Apesar dos campos `title` e `content` não serem obrigatórios, ao menos um deve ser incluido no body da requisição.

**Exemplo de requisição**

**`PATCH`** **`/update/post/:postId`**

**`PATCH`** **`/update/post/5da8a976-abf3-49ca-96ce-d1704bc5dcfe`**

**body**

```json
{
	"title": "ECMAScript 2021 é oficialmente standard",
	"content": "A nova versão do JavaScript, ECMAScript 2021, oficialmente virou standard. Desde 2015, todo ano, temos uma nova versão com adiç..."
}
```

## Resposta de sucesso

**Motivo:** A requisição foi enviada com sucesso, e o post foi atualizado.

**Código:** **`200 OK`**

```json
{
  "msg": "Successfully updated",
  "error": false
}
```

## Respostas de erros

**Motivo:** O `post` é inexistente.

**Código:** **`400 BAD REQUEST`**

```json
{
  "msg": "Post doesn't exist",
  "error": true
}
```

##### OU

**Motivo:** Nenhum campo foi passado para ser atualizado.

**Código:** **`422 UNPROCESSABLE ENTITY`**

```json
{
  "msg": "Title or content is required to update",
  "error": true
}
```

---

# Excluir Post

Somente o **`autor`** do `post` poderá deletá-lo.

| URL                        | Método      | Autenticação requerida |
|----------------------------|-------------|------------------------|
| **`/delete/post/:postId`** | **`PATCH`** | **`SIM`**              |

**Parâmetro obrigatório:**

| Campo         | Tipo       | In       | Descrição  |
|---------------|------------|----------|------------|
| **`:postId`** | **`UUID`** | URL path | Id do post |

**Exemplo de requisição**

**`DELETE`** **`/delete/post/:postId`**

**`DELETE`** **`/delete/post/52262e44-8768-4167-b9d0-b2461b18bca5`**

## Resposta de sucesso

**Motivo:** A requisição foi enviada com sucesso, e o post foi deletado.

**Código:** **`200 OK`**

```json
{
  "msg": "Successfully deleted",
  "error": false
}
```

## Respostas de erros

**Motivo:** O `post` é inexistente.

**Código:** **`400 BAD REQUEST`**

```json
{
  "msg": "Post doesn't exist",
  "error": true
}
```

---

# Erros comuns

## Missing fields

**Motivo:** Algum campo obrigatório não foi passado no body da requisição. No exemplo abaixo, o campo `firstName` não foi informado.

**Código:** **`422 UNPROCESSABLE ENTITY`**

```json
{
  "msg": "Missing fields",
  "missingFields": [
    "firstName"
  ],
  "error": true
}
```

---

## Invalid id

**Motivo:** O parâmetro `:userId` ou `:postId`, foi informado, porém não corresponde com um tipo `UUID`.

**Código:** **`400 BAD REQUEST`**

```json
{
  "msg": "Invalid id",
  "error": true
}
```
