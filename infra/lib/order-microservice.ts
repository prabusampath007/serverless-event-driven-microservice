import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { APP_CONSTANTS } from "../constants/app";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as lambdaEventSources from "aws-cdk-lib/aws-lambda-event-sources";
import * as apigateway from "aws-cdk-lib/aws-apigateway";

interface EventRuleStackProps extends cdk.StackProps {
  ordersQueueArn: string;
  productTableName: string;
  basketTableName: string;
}

export class OrderMicroserviceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: EventRuleStackProps) {
    super(scope, id, props);

    const orderDB = new dynamodb.Table(this, "OrderDynamoDB", {
      tableName: `${APP_CONSTANTS.APP_NAME}-${APP_CONSTANTS.STAGE}-order`,
      partitionKey: {
        name: "OrderId",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "ProductId",
        type: dynamodb.AttributeType.STRING,
      },
      readCapacity: 3,
      writeCapacity: 3,
    });

    const iamRole = new iam.Role(this, "OrderLambdaRole", {
      roleName: `${APP_CONSTANTS.APP_NAME}-${APP_CONSTANTS.STAGE}-order-role`,
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
    });
    iamRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonDynamoDBFullAccess")
    );
    iamRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("CloudWatchFullAccess")
    );

    const processOrderLambda = new lambda.Function(
      this,
      "ProcessOrderLambdaFunction",
      {
        functionName: `${APP_CONSTANTS.APP_NAME}-${APP_CONSTANTS.STAGE}-process-order`,
        handler: "order.processOrderHandler",
        runtime: lambda.Runtime.NODEJS_18_X,
        code: lambda.Code.fromAsset("../micro-services/dist"),
        role: iamRole,
        environment: {
          ORDER_TABLE: orderDB.tableName,
          BASKET_TABLE: props.basketTableName,
          PRODUCT_TABLE: props.productTableName,
        },
      }
    );

    const getAllOrdersLambda = new lambda.Function(
      this,
      "GetAllOrdersLambdaFunction",
      {
        functionName: `${APP_CONSTANTS.APP_NAME}-${APP_CONSTANTS.STAGE}-get-all-order`,
        handler: "order.getAllOrdersHandler",
        runtime: lambda.Runtime.NODEJS_18_X,
        code: lambda.Code.fromAsset("../micro-services/dist"),
        role: iamRole,
        environment: {
          ORDER_TABLE: orderDB.tableName,
        },
      }
    );

    const orderApi = new apigateway.LambdaRestApi(this, "OrderApiGateway", {
      handler: getAllOrdersLambda,
      restApiName: `${APP_CONSTANTS.APP_NAME}-${APP_CONSTANTS.STAGE}-order-api`,
      deploy: true,
      proxy: false,
    });

    const orderResource = orderApi.root.addResource("order");
    const getAllOrderstMethod = orderResource.addMethod(
      "GET",
      new apigateway.LambdaIntegration(getAllOrdersLambda)
    );

    const ordersQueue = sqs.Queue.fromQueueArn(
      this,
      "OrdersQueue",
      props.ordersQueueArn
    );

    const orderEventSource = new lambdaEventSources.SqsEventSource(ordersQueue);

    processOrderLambda.addEventSource(orderEventSource);
  }
}
