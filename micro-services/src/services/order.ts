import {
  getAllItems,
  getItem,
  putItem,
  queryBasketItems,
} from "../utils/dynamodb";
import { randomUUID } from "crypto";

export async function processOrder(baskedId: string) {
  console.log("Processing order");
  const orderId = randomUUID();
  const basketItems = await queryBasketItems(
    process.env.BASKET_TABLE as string,
    baskedId
  );

  console.log("Basket Items", basketItems);

  for (const item of basketItems) {
    const product = await getItem(process.env.PRODUCT_TABLE as string, {
      ProductId: item.ProductId,
    });
    await createOrder(orderId, item.ProductId, item.quantity * product.price);
  }
}

async function createOrder(orderId: string, productId: string, price: number) {
  const response = await putItem(process.env.ORDER_TABLE as string, {
    OrderId: orderId,
    ProductId: productId,
    price,
  });
  console.log("Create order response", response);
  return response;
}

export async function getAllOrders() {
  return await getAllItems(process.env.ORDER_TABLE as string);
}
