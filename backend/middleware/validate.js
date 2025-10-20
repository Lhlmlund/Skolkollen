export function validateBody(schema) {
  return async (req, res, next) => {
    const r = await schema.safeParseAsync(req.body);
    if (!r.success) {
      return res.status(400).json({ error: 'Validation error', details: r.error.issues });
    }
    req.body = r.data;
    next();
  };
}

export function validateParams(schema) {
  return (req, res, next) => {
    const r = schema.safeParse(req.params);
    if (!r.success) {
      return res.status(400).json({ error: 'Invalid path params', details: r.error.issues });
    }
    req.params = r.data;
    next();
  };
}

export function validateQuery(schema) {
  return (req, res, next) => {
    const r = schema.safeParse(req.query);
    if (!r.success) {
      return res.status(400).json({ error: 'Invalid query', details: r.error.issues });
    }
    req.query = r.data;
    next();
  };
}