export function wrapRoute(handler, errorMessage) {
  return async (request, response, next) => {
    try {
      await handler(request, response, next);
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: errorMessage });
    }
  };
}
