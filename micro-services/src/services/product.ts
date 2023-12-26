import { deleteItem, getItem, putItem } from "../utils/dynamodb";
import { randomUUID } from "crypto";

export async function createProduct(body: any) {
  const response = await putItem(process.env.PRODUCT_TABLE as string, {
    ProductId: `${randomUUID()}`,
    Name: body.name,
    price: body.price,
    quantity: body.quantity,
    unit: body.unit,
  });
  return response;
}

export async function updateProduct(productId: string, body: any) {
  const response = await putItem(process.env.PRODUCT_TABLE as string, {
    ProductId: productId,
    Name: body.name,
    price: body.price,
    quantity: body.quantity,
    unit: body.unit,
  });
  return response;
}

export async function getProduct(productId: string) {
  const response = await getItem(process.env.PRODUCT_TABLE as string, {
    ProductId: productId,
  });
  return response;
}

export async function deleteProduct(productId: string) {
  const response = await deleteItem(process.env.PRODUCT_TABLE as string, {
    ProductId: productId,
  });
  return response;
}
