import crypto from "crypto";

// hashing the refreshToken before storing it in the DB

export const hashToken = (token: string): string => {
    return crypto.createHash("sha256").update(token).digest("hex")
}

export const verifyToken = (token: string, hashedToken: string): boolean => {
    return hashToken(token) === hashedToken
}

// Generate a cryptographically secure random string.
export const generateSecureToken = (
    bytes = 32
): string => {
    return crypto.randomBytes(bytes).toString("hex");
};