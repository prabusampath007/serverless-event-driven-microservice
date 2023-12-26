import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { APP_CONSTANTS } from "../constants/app";

export class ProductMicroserviceStack extends cdk.Stack {
  public readonly productTableName: string;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const productDB = new dynamodb.Table(this, "ProductDynamoDB", {
      tableName: `${APP_CONSTANTS.APP_NAME}-${APP_CONSTANTS.STAGE}-product`,
      partitionKey: {
        name: "ProductId",
        type: dynamodb.AttributeType.STRING,
      },
      readCapacity: 3,
      writeCapacity: 3,
    });

    this.productTableName = productDB.tableName;

    const iamRole = new iam.Role(this, "ProductLambdaRole", {
      roleName: `${APP_CONSTANTS.APP_NAME}-${APP_CONSTANTS.STAGE}-product-role`,
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
    });
    iamRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonDynamoDBFullAccess")
    );
    iamRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("CloudWatchFullAccess")
    );

    const createProductionLambda = new lambda.Function(
      this,
      "CreateProductLambdaFunction",
      {
        functionName: `${APP_CONSTANTS.APP_NAME}-${APP_CONSTANTS.STAGE}-create-product`,
        handler: "product.createProductHandler",
        runtime: lambda.Runtime.NODEJS_18_X,
        code: lambda.Code.fromAsset("../micro-services/dist"),
        role: iamRole,
        environment: {
          PRODUCT_TABLE: productDB.tableName,
        },
      }
    );

    const deleteProductionLambda = new lambda.Function(
      this,
      "DeleteProductLambdaFunction",
      {
        functionName: `${APP_CONSTANTS.APP_NAME}-${APP_CONSTANTS.STAGE}-delete-product`,
        handler: "product.deleteProductHandler",
        runtime: lambda.Runtime.NODEJS_18_X,
        code: lambda.Code.fromAsset("../micro-services/dist"),
        role: iamRole,
        environment: {
          PRODUCT_TABLE: productDB.tableName,
        },
      }
    );

    const getProductionLambda = new lambda.Function(
      this,
      "GetProductLambdaFunction",
      {
        functionName: `${APP_CONSTANTS.APP_NAME}-${APP_CONSTANTS.STAGE}-get-product`,
        handler: "product.getProductHandler",
        runtime: lambda.Runtime.NODEJS_18_X,
        code: lambda.Code.fromAsset("../micro-services/dist"),
        role: iamRole,
        environment: {
          PRODUCT_TABLE: productDB.tableName,
        },
      }
    );

    const getAllProductionLambda = new lambda.Function(
      this,
      "GetAllProductLambdaFunction",
      {
        functionName: `${APP_CONSTANTS.APP_NAME}-${APP_CONSTANTS.STAGE}-get-all-product`,
        handler: "product.getAllProductHandler",
        runtime: lambda.Runtime.NODEJS_18_X,
        code: lambda.Code.fromAsset("../micro-services/dist"),
        role: iamRole,
        environment: {
          PRODUCT_TABLE: productDB.tableName,
        },
      }
    );

    const updateProductionLambda = new lambda.Function(
      this,
      "UpdateProductLambdaFunction",
      {
        functionName: `${APP_CONSTANTS.APP_NAME}-${APP_CONSTANTS.STAGE}-update-product`,
        handler: "product.updateProductHandler",
        runtime: lambda.Runtime.NODEJS_18_X,
        code: lambda.Code.fromAsset("../micro-services/dist"),
        role: iamRole,
        environment: {
          PRODUCT_TABLE: productDB.tableName,
        },
      }
    );

    const productApi = new apigateway.LambdaRestApi(this, "ProductApiGateway", {
      handler: createProductionLambda,
      restApiName: `${APP_CONSTANTS.APP_NAME}-${APP_CONSTANTS.STAGE}-product-api`,
      deploy: true,
      proxy: false,
    });

    const productResource = productApi.root.addResource("product");
    const createProductMethod = productResource.addMethod(
      "POST",
      new apigateway.LambdaIntegration(createProductionLambda)
    );

    const productWithIdResource = productResource.addResource("{productId}");
    const getProductMethod = productWithIdResource.addMethod(
      "GET",
      new apigateway.LambdaIntegration(getProductionLambda)
    );
    const updateProductMethod = productWithIdResource.addMethod(
      "PATCH",
      new apigateway.LambdaIntegration(updateProductionLambda)
    );
    const deleteProductMethod = productWithIdResource.addMethod(
      "DELETE",
      new apigateway.LambdaIntegration(deleteProductionLambda)
    );
  }
}
