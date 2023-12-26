import { getAllOrders, processOrder } from "../services/order";
import { lambdaResponse } from "../utils/response";

export const processOrderHandler = async (event: any) => {
  const batchItemFailures = [];
  console.log(event.Records);

  for (const record of event.Records) {
    try {
      const orderEvent = JSON.parse(record.body);
      const baskedId = orderEvent.detail.baskedId;
      await processOrder(baskedId);
    } catch (error) {
      batchItemFailures.push({ ItemIdentifier: record.messageId });
      console.log(error);
    }
  }

  return lambdaResponse(200, {
    batchItemFailures,
  });
};

export const getAllOrdersHandler = async (event: any) => {
  try {
    const response = await getAllOrders();
    return lambdaResponse(200, {
      data: response,
    });
  } catch (err) {
    return lambdaResponse(400, {
      err,
    });
  }
};

// processOrderHandler({
//   Records: [
//     {
//       messageId: "7720764c-a0e9-4b6b-b381-f22459d795a5",
//       receiptHandle:
//         "AQEBibKD8C30CX/3W5iC17AXAu8aAPeQrw9NGA1AG11OjitnYgCNfya/3JIxuTWV009xqTL9f/GSz4NOQrVEXwBFWF+ECnE5nrbb8+5DeBg8iEljVLufs4cDvna+6GZjOwVUlh53AOVG4n7HjREW2NavOlG+PgNsdQS3iTXyioH8KJ7EZ8vIxa1CUZJJOJoLs9CZ0JMETPtlVUAr84NbEviL/JpdHow36uC09VKIAAgQ7IFD+iwPrQpKh87LZLMLc3ArRDO/AuLsSkK72xTuYCyLhYrrDQ8UG5OGaX1I8J6Z8Q/KGUznYt+pXB0PrdYHB7guY7ACcpj9CxMPYkrKM18JENDJaNPBSOvV22ImcTyXUll5S+XigNait+yE6BgSaJyXhpugl82xsw0UrYECCTkSyQ==",
//       body: '{"version":"0","id":"20a878f5-77b5-5d31-a856-f485ae13034f","detail-type":"Place Order","source":"ecommerce.dev.basket.lambda","account":"877969058937","time":"2023-12-26T13:05:20Z","region":"us-east-1","resources":[],"detail":{"baskedId":"eaf309ec-5850-48de-9520-21667252b79e"}}',
//       attributes: {
//         ApproximateReceiveCount: "1",
//         AWSTraceHeader:
//           "Root=1-658acf8f-4f8f87a9644c4e1842d936cb;Parent=24417bff5ce94ee2;Sampled=0;Lineage=a2a5ba70:0",
//         SentTimestamp: "1703595920318",
//         SenderId: "AIDAJXNJGGKNS7OSV23OI",
//         ApproximateFirstReceiveTimestamp: "1703595920326",
//       },
//       messageAttributes: {},
//       md5OfBody: "d308a6d534e5c9fbb506643604f1ce64",
//       eventSource: "aws:sqs",
//       eventSourceARN: "arn:aws:sqs:us-east-1:877969058937:ecommerce-dev-orders",
//       awsRegion: "us-east-1",
//     },
//   ],
// })
//   .then((value) => console.log(value))
//   .catch((err) => console.error(err));
