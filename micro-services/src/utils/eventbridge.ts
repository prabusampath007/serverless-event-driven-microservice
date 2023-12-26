import {
  EventBridgeClient,
  PutEventsCommand,
} from "@aws-sdk/client-eventbridge";

export const putEvents = async (
  busName: string,
  source: string,
  detailType: string,
  detail: any,
  resources = []
) => {
  const client = new EventBridgeClient({});

  const response = await client.send(
    new PutEventsCommand({
      Entries: [
        {
          Detail: JSON.stringify(detail),
          DetailType: detailType,
          Resources: resources,
          Source: source,
          EventBusName: busName,
        },
      ],
    })
  );

  console.log("PutEvents response:");
  console.log(response);

  return response;
};
