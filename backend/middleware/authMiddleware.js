import jwt from 'jsonwebtoken'

export function getToken(row) {
    return jwt.sign({
        userId: row.userId, role: row.role
    }, process.env.JWT_SECRET, {expiresIn: '1d'})
}

// Token format: "Bearer <token>"
export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({message: 'Access denied. No token provided.'});
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // attach user data (userId, role)
        next();
    } catch (err) {
        return res.status(403).json({message: 'Invalid or expired token.'});
    }
}

export function authorizeRoles(...roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: insufficient permissions.' });
        }
        next();
    };
}
