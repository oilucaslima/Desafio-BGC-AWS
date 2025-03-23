"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inserirProduto = exports.criarTabela = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client_dynamodb_2 = require("@aws-sdk/client-dynamodb");
const dynamoDBClient = new client_dynamodb_1.DynamoDBClient({ region: 'us-east-1' });
const docClient = lib_dynamodb_1.DynamoDBDocumentClient.from(dynamoDBClient);
const criarTabela = async (nomeDaTabela) => {
    try {
        // Verifica se a tabela já existe
        const listTablesCommand = new client_dynamodb_1.ListTablesCommand({});
        const tablesResponse = await dynamoDBClient.send(listTablesCommand);
        if (tablesResponse.TableNames?.includes(nomeDaTabela)) {
            console.log(`A tabela "${nomeDaTabela}" já existe.`);
            return;
        }
        const createTableCommand = new client_dynamodb_1.CreateTableCommand({
            TableName: nomeDaTabela,
            KeySchema: [
                // Categoria esta como chave primáriake o rank como chave de ordenação
                { AttributeName: 'categoryId', KeyType: 'HASH' },
                { AttributeName: 'rank', KeyType: 'RANGE' },
            ],
            AttributeDefinitions: [
                { AttributeName: 'categoryId', AttributeType: 'S' },
                { AttributeName: 'rank', AttributeType: 'N' },
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5,
            },
        });
        await dynamoDBClient.send(createTableCommand);
        console.log(`Tabela "${nomeDaTabela}" criada com sucesso.`);
    }
    catch (error) {
        console.error('Erro ao verificar/criar a tabela:', error);
    }
};
exports.criarTabela = criarTabela;
// Função para inserir os itens no DynamoDB
const inserirProduto = async (nomeDaTabela, categoria, produto) => {
    try {
        // Verifica se o produto já existe
        const getParams = {
            TableName: nomeDaTabela,
            Key: {
                categoryId: { S: categoria },
                rank: { N: produto.rank.toString() },
            },
        };
        const getItemCommand = new client_dynamodb_2.GetItemCommand(getParams);
        const getItemResponse = await dynamoDBClient.send(getItemCommand);
        if (getItemResponse.Item) {
            console.log(`Produto com rank ${produto.rank} já está cadastrado na categoria "${categoria}".`);
            return;
        }
        // Insere o produto se ele não existir
        const putParams = {
            TableName: nomeDaTabela,
            Item: {
                categoryId: { S: categoria },
                rank: { N: produto.rank.toString() },
                name: { S: produto.name },
                price: { S: produto.price },
                rating: { S: produto.rating },
                link: { S: produto.link },
            },
        };
        await dynamoDBClient.send(new client_dynamodb_2.PutItemCommand(putParams));
        console.log(`Produto "${produto.name}" inserido com sucesso na categoria "${categoria}", rank ${produto.rank}!`);
    }
    catch (error) {
        console.error('Erro ao inserir o produto:', error);
    }
};
exports.inserirProduto = inserirProduto;
