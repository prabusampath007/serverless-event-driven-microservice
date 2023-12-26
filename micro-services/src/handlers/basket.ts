import {
  createBasket,
  deleteBasket,
  getBasket,
  placeOrder,
  updateBasket,
} from "../services/basket";
import { lambdaResponse } from "../utils/response";

export const createBasketHandler = async (event: any) => {
  try {
    const requestBody = JSON.parse(event.body);
    await createBasket(requestBody);
    return lambdaResponse(200, {
      message: "Basket inserted successfully",
    });
  } catch (err) {
    return lambdaResponse(400, {
      err,
    });
  }
};

export const updateBasketHandler = async (event: any) => {
  try {
    const requestBody = JSON.parse(event.body);
    const basketId = event.queryStringParameters.basketId;
    const productId = event.queryStringParameters.productId;
    const response = await updateBasket(
      basketId,
      productId,
      requestBody.quantity
    );
    return lambdaResponse(200, {
      message: "Basket updated successfully",
    });
  } catch (err) {
    console.error(err);
    return lambdaResponse(400, {
      err,
    });
  }
};

export const getBasketHandler = async (event: any) => {
  try {
    const basketId = event.queryStringParameters.basketId;
    const productId = event.queryStringParameters.productId;
    const response = await getBasket(basketId, productId);
    return lambdaResponse(200, {
      ...response,
    });
  } catch (err) {
    return lambdaResponse(400, {
      err,
    });
  }
};

export const deleteBasketHandler = async (event: any) => {
  try {
    const basketId = event.queryStringParameters.basketId;
    const productId = event.queryStringParameters.productId;
    const response = await deleteBasket(basketId, productId);
    return lambdaResponse(200, {
      message: "Basket deleted successfully",
    });
  } catch (err) {
    return lambdaResponse(400, {
      err,
    });
  }
};

export const placeOrderHandler = async (event: any) => {
  try {
    const basketId = event.queryStringParameters.basketId;
    const response = await placeOrder(basketId);
    return lambdaResponse(200, {
      message: "Order placed successfully",
    });
  } catch (err) {
    return lambdaResponse(400, {
      err,
    });
  }
};
