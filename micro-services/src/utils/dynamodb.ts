import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  PutCommand,
  DynamoDBDocumentClient,
  GetCommand,
  DeleteCommand,
  QueryCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export async function putItem(tableName: string, item: any) {
  const command = new PutCommand({
    TableName: tableName,
    Item: item,
  });

  const response = await docClient.send(command);
  console.log(response);
  return response;
}

export async function getItem(tableName: string, key: any) {
  const command = new GetCommand({
    TableName: tableName,
    Key: {
      ...key,
    },
  });

  const response = await docClient.send(command);
  console.log(response);
  return response.Item ?? {};
}

export async function deleteItem(tableName: string, key: any) {
  const command = new DeleteCommand({
    TableName: tableName,
    Key: {
      ...key,
    },
  });

  const response = await docClient.send(command);
  console.log(response);
  return response;
}

export async function queryBasketItems(tableName: string, baskedId: string) {
  const command = new QueryCommand({
    TableName: tableName,
    KeyConditionExpression: "#basketId = :basketIdValue",
    ExpressionAttributeValues: {
      ":basketIdValue": baskedId,
    },
    ExpressionAttributeNames: {
      "#basketId": "BasketId",
    },
  });
  const response = await docClient.send(command);
  console.log(response);
  return response.Items ?? [];
}

export async function getAllItems(tableName: string) {
  const command = new ScanCommand({
    TableName: tableName,
  });

  const response = await client.send(command);
  return response.Items ?? [];
}
