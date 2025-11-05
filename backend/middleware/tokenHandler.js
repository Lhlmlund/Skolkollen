import jwt from 'jsonwebtoken'

export function getToken(row) {
    return jwt.sign({})
}
