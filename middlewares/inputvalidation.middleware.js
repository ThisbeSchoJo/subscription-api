

export const inputValidationMiddleware = (req, res, next) => {
  const { name, email, password } = req.body;
  const missing = [].concat(
    !name ? "name" : [],
    !email ? "email" : [],
    !password ? "password" : [],
  );
  if (missing.length) {
    const error = new Error(`Missing required fields: ${missing.join(", ")}`);
    error.statusCode = 400;
    throw error;
  }
}