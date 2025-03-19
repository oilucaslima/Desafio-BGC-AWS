// dynamo.ts

import { DynamoDBClient, CreateTableCommand, ListTablesCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

// Inicializando o DynamoDB Client
const dynamoDBClient = new DynamoDBClient({ region: 'us-east-1' }); // Defina a região correta
const docClient = DynamoDBDocumentClient.from(dynamoDBClient);

export const criarTabela = async (nomeDaTabela: string): Promise<void> => {
  try {
    // Verifica se a tabela já existe
    const listTablesCommand = new ListTablesCommand({});
    const tablesResponse = await dynamoDBClient.send(listTablesCommand);

    if (tablesResponse.TableNames?.includes(nomeDaTabela)) {
      console.log(`A tabela "${nomeDaTabela}" já existe.`);
      return;
    }

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

    await dynamoDBClient.send(createTableCommand);
    console.log(`Tabela "${nomeDaTabela}" criada com sucesso.`);
  } catch (error) {
    console.error('Erro ao verificar/criar a tabela:', error);
  }
};
