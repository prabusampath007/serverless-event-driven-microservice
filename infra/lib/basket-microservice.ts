import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { APP_CONSTANTS } from "../constants/app";
import { ORDER_BUS_NAME, ORDER_CONSTANTS } from "../constants/event";

export class BasketMicroserviceStack extends cdk.Stack {
  public readonly basketTableName: string;

  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const baksetDB = new dynamodb.Table(this, "BasketDynamoDB", {
      tableName: `${APP_CONSTANTS.APP_NAME}-${APP_CONSTANTS.STAGE}-basket`,
      partitionKey: {
        name: "BasketId",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "ProductId",
        type: dynamodb.AttributeType.STRING,
      },
      readCapacity: 3,
      writeCapacity: 3,
    });

    this.basketTableName = baksetDB.tableName;

    const iamRole = new iam.Role(this, "BasketLambdaRole", {
      roleName: `${APP_CONSTANTS.APP_NAME}-${APP_CONSTANTS.STAGE}-basket-role`,
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
    });
    iamRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonDynamoDBFullAccess")
    );
    iamRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("CloudWatchFullAccess")
    );
    iamRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("CloudWatchEventsFullAccess")
    );

    const createBasketLambda = new lambda.Function(
      this,
      "CreateBasketLambdaFunction",
      {
        functionName: `${APP_CONSTANTS.APP_NAME}-${APP_CONSTANTS.STAGE}-create-basket`,
        handler: "basket.createBasketHandler",
        runtime: lambda.Runtime.NODEJS_18_X,
        code: lambda.Code.fromAsset("../micro-services/dist"),
        role: iamRole,
        environment: {
          PRODUCT_TABLE: baksetDB.tableName,
        },
      }
    );

    const deleteBasketLambda = new lambda.Function(
      this,
      "DeleteBasketLambdaFunction",
      {
        functionName: `${APP_CONSTANTS.APP_NAME}-${APP_CONSTANTS.STAGE}-delete-basket`,
        handler: "basket.deleteBasketHandler",
        runtime: lambda.Runtime.NODEJS_18_X,
        code: lambda.Code.fromAsset("../micro-services/dist"),
        role: iamRole,
        environment: {
          PRODUCT_TABLE: baksetDB.tableName,
        },
      }
    );

    const getBasketLambda = new lambda.Function(
      this,
      "GetBasketLambdaFunction",
      {
        functionName: `${APP_CONSTANTS.APP_NAME}-${APP_CONSTANTS.STAGE}-get-basket`,
        handler: "basket.getBasketHandler",
        runtime: lambda.Runtime.NODEJS_18_X,
        code: lambda.Code.fromAsset("../micro-services/dist"),
        role: iamRole,
        environment: {
          PRODUCT_TABLE: baksetDB.tableName,
        },
      }
    );

    const getAllBasketLambda = new lambda.Function(
      this,
      "GetAllProductLambdaFunction",
      {
        functionName: `${APP_CONSTANTS.APP_NAME}-${APP_CONSTANTS.STAGE}-get-all-basket`,
        handler: "basket.getAllBasketHandler",
        runtime: lambda.Runtime.NODEJS_18_X,
        code: lambda.Code.fromAsset("../micro-services/dist"),
        role: iamRole,
        environment: {
          PRODUCT_TABLE: baksetDB.tableName,
        },
      }
    );

    const updateBasketLambda = new lambda.Function(
      this,
      "UpdateBasketLambdaFunction",
      {
        functionName: `${APP_CONSTANTS.APP_NAME}-${APP_CONSTANTS.STAGE}-update-basket`,
        handler: "basket.updateProductHandler",
        runtime: lambda.Runtime.NODEJS_18_X,
        code: lambda.Code.fromAsset("../micro-services/dist"),
        role: iamRole,
        environment: {
          PRODUCT_TABLE: baksetDB.tableName,
        },
      }
    );

    const placeOrderLambda = new lambda.Function(
      this,
      "PlaceOrderLambdaFunction",
      {
        functionName: `${APP_CONSTANTS.APP_NAME}-${APP_CONSTANTS.STAGE}-place-order`,
        handler: "basket.placeOrderHandler",
        runtime: lambda.Runtime.NODEJS_18_X,
        code: lambda.Code.fromAsset("../micro-services/dist"),
        role: iamRole,
        environment: {
          PRODUCT_TABLE: baksetDB.tableName,
          ORDER_EVENT_SOURCE: ORDER_CONSTANTS.SOURCE,
          PLACE_ORDER_DETAIL_TYPE: ORDER_CONSTANTS.DETAIL_TYPE,
          ORDER_BUS_NAME: ORDER_BUS_NAME,
        },
      }
    );

    const basketApi = new apigateway.LambdaRestApi(this, "BasketApiGateway", {
      handler: createBasketLambda,
      restApiName: `${APP_CONSTANTS.APP_NAME}-${APP_CONSTANTS.STAGE}-basket-api`,
      deploy: true,
      proxy: false,
    });

    const basketResource = basketApi.root.addResource("basket");
    const createBasketMethod = basketResource.addMethod(
      "POST",
      new apigateway.LambdaIntegration(createBasketLambda)
    );

    const getBasketMethod = basketResource.addMethod(
      "GET",
      new apigateway.LambdaIntegration(getBasketLambda)
    );
    const updateBaskettMethod = basketResource.addMethod(
      "PATCH",
      new apigateway.LambdaIntegration(updateBasketLambda)
    );
    const deleteBasketMethod = basketResource.addMethod(
      "DELETE",
      new apigateway.LambdaIntegration(deleteBasketLambda)
    );

    const placeOrderResource = basketApi.root.addResource("placeOrder");
    const placeOrderMethod = placeOrderResource.addMethod(
      "POST",
      new apigateway.LambdaIntegration(placeOrderLambda)
    );
  }
}
