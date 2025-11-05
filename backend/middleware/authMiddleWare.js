import jwt from 'jsonwebtoken'

export function getToken(row) {
    return jwt.sign({
        userId: row.userId, role: row.role
    }, process.env.JWT_SECRET, {expiresIn: '1d'})
}
