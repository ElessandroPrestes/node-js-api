# API/REST in Node.js

Api/Rest desenvolvida aplicando testes(TDD)


## Tecnologias utilizadas

* [NODE JS](https://nodejs.org/en/)  
* [EXPRESS](https://expressjs.com/) 
* [JEST](https://jestjs.io/) 
* [KNEX.JS](https://knexjs.org/) 
* [POSTGRESQL](https://www.postgresql.org/) 

## Servidor Node.js
npm start
## Teste (TDD) em tempo real 
npm run jest-watch

## Habilitando o eslint no projeto
npm i -D eslint – indica que está instalando a dependência eslint em ambiente de desenvolvimento só.
 Após isso, executar no terminal 
 * .\node_modules\.bin\eslint –init

Configurações escolhidas: default

Configurações do eslint

Realizando a verificação de formatação dos arquivos que estão nas pastas server e test:

* .\node_modules\.bin\eslint server/** test/** --fix

Para executar npm run lint, tem que adicionar o parâmetro lint no arquivo package.json: 

````
"scripts": { 
  "lint": "eslint server/** test/** --fix",
},
````

## MIGRATIONS 
 Criando uma migration pelo terminal:
 * node_modules/.bin/knex migrate:make create_users --env test

 Aplicando todas as migrações possíveis:
* node_modules/.bin/knex migrate:latest --env test

 Voltando a aplicação da migrations:
 * node_modules/.bin/knex migrate:rollback --env test

## Dependencias para criptografia de senha e autenticacão

* npm i -S -E bcrypt-nodejs

* npm i -S -E jwt-simple

* npm i -S -E passport

* npm i -S -E passport-jwt

## Para aumentar a confiança nos commits
Antes de fazer commits no git, podemos verificar se as boas práticas do lint estão sendo cumpridas e se os testes estão passando.

Para fazer os commits apenas se os testes estão passando e se as alterações, precisamos instalar a dependência:
 * npm i -S -E husky

E depois, basta adicionar isso no package.json:
````
"scripts": { ... },
  "husky":{
    "hooks": { "npm run lint && npm run test" }
  },
````
## Autor

* **Elessandro Prestes Macedo** - [linkedin](https://www.linkedin.com/in/elessandro-prestes-macedo-278189126/)




