import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
import { APP_CONSTANTS } from "../constants/app";
import * as sqs from "aws-cdk-lib/aws-sqs";
import { ORDER_CONSTANTS } from "../constants/event";

interface EventRuleStackProps extends cdk.StackProps {
  ordersQueueArn: string;
}

export class EventRuleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: EventRuleStackProps) {
    super(scope, id, props);

    const orderBus = new events.EventBus(this, "OrderBus", {
      eventBusName: `${APP_CONSTANTS.APP_NAME}-${APP_CONSTANTS.STAGE}-order`,
    });

    const orderRule = new events.Rule(this, "OrderRule", {
      eventPattern: {
        source: [ORDER_CONSTANTS.SOURCE],
        detailType: [ORDER_CONSTANTS.DETAIL_TYPE],
      },
      ruleName: `${APP_CONSTANTS.APP_NAME}-${APP_CONSTANTS.STAGE}-order`,
      eventBus: orderBus,
    });

    const ordersQueue = sqs.Queue.fromQueueArn(
      this,
      "OrdersQueue",
      props.ordersQueueArn
    );

    orderRule.addTarget(new targets.SqsQueue(ordersQueue));
  }
}
