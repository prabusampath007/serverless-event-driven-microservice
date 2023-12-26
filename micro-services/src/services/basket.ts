import {
  deleteItem,
  getItem,
  putItem,
  queryBasketItems,
} from "../utils/dynamodb";
import { randomUUID } from "crypto";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { putEvents } from "../utils/eventbridge";

export async function createBasket(body: any) {
  const response = await putItem(process.env.PRODUCT_TABLE as string, {
    BasketId: randomUUID(),
    ProductId: body.productId,
    quantity: body.quantity,
  });
  return response;
}

export async function updateBasket(
  basketId: string,
  productId: string,
  quantity: number
) {
  const response = await putItem(process.env.PRODUCT_TABLE as string, {
    BasketId: basketId,
    ProductId: productId,
    quantity: quantity,
  });
  return response;
}

export async function getBasket(basketId: string, productId: string) {
  const response = await getItem(process.env.PRODUCT_TABLE as string, {
    BasketId: basketId,
    ProductId: productId,
  });
  return response;
}

export async function deleteBasket(basketId: string, productId: string) {
  const response = await deleteItem(process.env.PRODUCT_TABLE as string, {
    BasketId: basketId,
    ProductId: productId,
  });
  return response;
}

export async function placeOrder(baskedId: string) {
  await putEvents(
    process.env.ORDER_BUS_NAME as string,
    process.env.ORDER_EVENT_SOURCE as string,
    process.env.PLACE_ORDER_DETAIL_TYPE as string,
    { baskedId }
  );
}
