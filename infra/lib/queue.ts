import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as iam from "aws-cdk-lib/aws-iam";
import { APP_CONSTANTS } from "../constants/app";

export class QueueStack extends cdk.Stack {
  public readonly orderQueueArn: string;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const orderQueue = new sqs.Queue(this, "OrdersQueue", {
      queueName: `${APP_CONSTANTS.APP_NAME}-${APP_CONSTANTS.STAGE}-orders`,
    });

    orderQueue.addToResourcePolicy(
      new iam.PolicyStatement({
        principals: [new iam.AnyPrincipal()],
        actions: ["sqs:*"],
        resources: [orderQueue.queueArn],
      })
    );

    this.orderQueueArn = orderQueue.queueArn;
  }
}
