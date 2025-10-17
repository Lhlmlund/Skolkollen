export function validate(schema) {
    return async (req, res, next) => {
        const result = await schema.safeParseAsync(req.body);
        if (!result.success) {
            return res.status(400).json({
                error: "Validation error",
                details: result.error.errors.map((issue) => ({
                    path: issue.path.join('.'),
                    message: issue.message,
                })),
            });
        }
        req.body = result.data;
        next();
    };
}
