export function lambdaResponse(statusCode: number, msg?: any) {
  return {
    statusCode,
    body: msg ? JSON.stringify(msg) : "{}",
  };
}
