// dynamo.ts
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
// Inicializando o DynamoDB Client
const dynamoDBClient = new DynamoDBClient({ region: 'us-east-1' }); // Defina a região correta
const docClient = DynamoDBDocumentClient.from(dynamoDBClient);
export const criarTabelaSeNaoExistir = (nomeDaTabela) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Verifica se a tabela já existe
        const listTablesCommand = new ListTablesCommand({});
        const tablesResponse = yield dynamoDBClient.send(listTablesCommand);
        if ((_a = tablesResponse.TableNames) === null || _a === void 0 ? void 0 : _a.includes(nomeDaTabela)) {
            console.log(`A tabela "${nomeDaTabela}" já existe.`);
            return;
        }
        // Se não existir, cria a tabela
        const createTableCommand = new CreateTableCommand({
            TableName: nomeDaTabela,
            KeySchema: [
                { AttributeName: 'categoryId', KeyType: 'HASH' }, // Chave primária
            ],
            AttributeDefinitions: [
                { AttributeName: 'categoryId', AttributeType: 'S' }, // Tipo String para categoryId
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
