# Serverless - AWS Node.js Typescript

### INICIANDO PROJETO
- Execute `yarn` para instalar as dependencias

## Executando os testes
- Abra o seu docker-desktop e execute `docker-compose up` para rodar o dynamoDBLocal
- Execute `yarn test` para executar os testes
- Execute `yarn test:coverage` para verificar a cobertura dos testes
- Execute `yarn test:watch` para manter os testes assistidos

## DICAS
- Caso queira observar o dynamoDBLocalmente, siga os passos abaixo
    - Execute `npm install -g dynamodb-admin`
    - Execute `DYNAMO_ENDPOINT=http://localhost:8000 dynamodb-admin`
    - Acesse `http://localhost:8001`
    - Caso queira verificar a criação dos registros corretamente, pode comentar o afterAll que remove a tabela

## Rodando Localmente
- Abra o seu docker-desktop e execute `docker-compose up` para rodar o dynamoDBLocal
- Execute `npm install -g dynamodb-admin`
- Execute `DYNAMO_ENDPOINT=http://localhost:8000 dynamodb-admin`
- Instale o serverless framework (https://www.serverless.com/framework/docs)
- Execute `yarn run:local`

## Dando deploy
- Instale e configure suas credenciais AWS no Serverless Framework (https://www.serverless.com/framework/docs)
- Execute `sls deploy`
