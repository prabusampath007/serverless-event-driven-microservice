import {
  createProduct,
  deleteProduct,
  getProduct,
  updateProduct,
} from "../services/product";
import { lambdaResponse } from "../utils/response";

export const createProductHandler = async (event: any) => {
  try {
    const requestBody = JSON.parse(event.body);
    await createProduct(requestBody);
    return lambdaResponse(200, {
      message: "Product inserted successfully",
    });
  } catch (err) {
    return lambdaResponse(400, {
      err,
    });
  }
};

export const updateProductHandler = async (event: any) => {
  try {
    const requestBody = JSON.parse(event.body);
    const productId = event.pathParameters.productId;
    const response = await updateProduct(productId, requestBody);
    return lambdaResponse(200, {
      message: "Product updated successfully",
    });
  } catch (err) {
    return lambdaResponse(400, {
      err,
    });
  }
};

export const getProductHandler = async (event: any) => {
  try {
    const productId = event.pathParameters.productId;
    const response = await getProduct(productId);
    return lambdaResponse(200, {
      ...response,
    });
  } catch (err) {
    return lambdaResponse(400, {
      err,
    });
  }
};

export const deleteProductHandler = async (event: any) => {
  try {
    const productId = event.pathParameters.productId;
    const response = await deleteProduct(productId);
    return lambdaResponse(200, {
      message: "Product deleted successfully",
    });
  } catch (err) {
    return lambdaResponse(400, {
      err,
    });
  }
};
