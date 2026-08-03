
import dotenv from "dotenv"
dotenv.config()
import bcrypt from "bcrypt";
const SALT_ROUNDS = process.env.SALT_ROUNDS || 12

// Hash Plain Password

export const hashPassword = async (password: string): Promise<string> => {
    return bcrypt.hash(password, SALT_ROUNDS)
}

// Compare a plain text password with a hashed password.

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword)
}