#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { ProductMicroserviceStack } from "../lib/product-microservice";
import { BasketMicroserviceStack } from "../lib/basket-microservice";
import { QueueStack } from "../lib/queue";
import { APP_CONSTANTS } from "../constants/app";
import { ORDER_CONSTANTS } from "../constants/event";
import { EventRuleStack } from "../lib/event";
import { OrderMicroserviceStack } from "../lib/order-microservice";

const app = new cdk.App();

const productStack = new ProductMicroserviceStack(
  app,
  "ProductMicroserviceStack",
  {}
);

const basketStack = new BasketMicroserviceStack(
  app,
  "BasketMicroserviceStack",
  {}
);

const ordersQueueStack = new QueueStack(app, "OrderQueueStack", {});

new EventRuleStack(app, "OrderEventStack", {
  ordersQueueArn: ordersQueueStack.orderQueueArn,
});

new OrderMicroserviceStack(app, "OrderMicroserviceStack", {
  ordersQueueArn: ordersQueueStack.orderQueueArn,
  basketTableName: basketStack.basketTableName,
  productTableName: productStack.productTableName,
});
