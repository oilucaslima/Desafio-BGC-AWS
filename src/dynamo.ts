import { DynamoDBClient, CreateTableCommand, ListTablesCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { PutItemCommand, GetItemCommand } from '@aws-sdk/client-dynamodb';

const dynamoDBClient = new DynamoDBClient({ region: 'us-east-1' }); // Defina a região correta
const docClient = DynamoDBDocumentClient.from(dynamoDBClient);

export const criarTabela = async (nomeDaTabela: string): Promise<void> => {
    try 
    {
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
    catch (error) 
    {
        console.error('Erro ao verificar/criar a tabela:', error);
    }
};

// Função para inserir os itens no DynamoDB
export const inserirProduto = async (nomeDaTabela: string, categoria: string, produto: { name: string; price: string; rating: string; rank: number, link: string }) => {
    try 
    {
        // Verifica se o produto já existe
        const getParams = {
            TableName: nomeDaTabela,
            Key: {
                categoryId: { S: categoria }, 
                rank: { N: produto.rank.toString() },
            },
        };

        const getItemCommand = new GetItemCommand(getParams);
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

        await dynamoDBClient.send(new PutItemCommand(putParams));
        console.log(`Produto "${produto.name}" inserido com sucesso na categoria "${categoria}", rank ${produto.rank}!`);
    } 
    catch (error) 
    {
        console.error('Erro ao inserir o produto:', error);
    }
};

