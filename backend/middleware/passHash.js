import bcrypt from 'bcrypt'

export async function hashPassword (rawPassword){
    const saltRounds = 10;
    return await bcrypt.hash(rawPassword, saltRounds);
}

export async function checkPassword (rawPassword, hashedPassword){
    return bcrypt.compare(rawPassword, hashedPassword)
}
