import aj from '../config/arcjet.js';

const arcjetMiddleware = async (req, res, next) => {
  try {
    // Protect the request with Arcjet and tell me your decision
    const decision = await aj.protect(req, { requested: 1 });

    if(decision.isDenied()) {
      // If the request is denied, check the reason and return the appropriate error
      if(decision.reason.isRateLimit()) return res.status(429).json({ error: 'Rate limit exceeded' });
      if(decision.reason.isBot()) return res.status(403).json({ error: 'Bot detected' });

      return res.status(403).json({ error: 'Access denied' });
    }

    next();
  } catch (error) {
    console.log(`Arcjet Middleware Error: ${error}`);
    next(error);
  }
}

export default arcjetMiddleware;