import { APP_CONSTANTS } from "./app";

export const ORDER_CONSTANTS = {
  SOURCE: `${APP_CONSTANTS.APP_NAME}.${APP_CONSTANTS.STAGE}.basket.lambda`,
  DETAIL_TYPE: "Place Order",
};

export const ORDER_BUS_NAME = `${APP_CONSTANTS.APP_NAME}-${APP_CONSTANTS.STAGE}-order`;
