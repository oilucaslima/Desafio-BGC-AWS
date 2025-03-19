var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DynamoDBClient, CreateTableCommand, ListTablesCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { PutItemCommand, GetItemCommand } from '@aws-sdk/client-dynamodb';
const dynamoDBClient = new DynamoDBClient({ region: 'us-east-1' }); // Defina a região correta
const docClient = DynamoDBDocumentClient.from(dynamoDBClient);
export const criarTabela = (nomeDaTabela) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Verifica se a tabela já existe
        const listTablesCommand = new ListTablesCommand({});
        const tablesResponse = yield dynamoDBClient.send(listTablesCommand);
        if ((_a = tablesResponse.TableNames) === null || _a === void 0 ? void 0 : _a.includes(nomeDaTabela)) {
            console.log(`A tabela "${nomeDaTabela}" já existe.`);
            return;
        }
        const createTableCommand = new CreateTableCommand({
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
        yield dynamoDBClient.send(createTableCommand);
        console.log(`Tabela "${nomeDaTabela}" criada com sucesso.`);
    }
    catch (error) {
        console.error('Erro ao verificar/criar a tabela:', error);
    }
});
// Função para inserir os itens no DynamoDB
export const inserirProduto = (nomeDaTabela, categoria, produto) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Verifica se o produto já existe
        const getParams = {
            TableName: nomeDaTabela,
            Key: {
                categoryId: { S: categoria },
                rank: { N: produto.rank.toString() },
            },
        };
        const getItemCommand = new GetItemCommand(getParams);
        const getItemResponse = yield dynamoDBClient.send(getItemCommand);
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
        yield dynamoDBClient.send(new PutItemCommand(putParams));
        console.log(`Produto "${produto.name}" inserido com sucesso na categoria "${categoria}", rank ${produto.rank}!`);
    }
    catch (error) {
        console.error('Erro ao inserir o produto:', error);
    }
});
