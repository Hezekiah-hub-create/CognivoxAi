import "server-only";
import { JWTPayload, SignJWT, jwtVerify } from "jose";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: JWTPayload){
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256"})
        .setExpirationTime("7d")
        .sign(encodedKey);
}

export async function decrypt(session: string | undefined = ""){
    if (!session) return null;
    try {
        const { payload } = await jwtVerify(session, encodedKey);
        return payload;
    } catch (error) {
        const {payload} = await jwtVerify(session, encodedKey, {algorithms: ["HS256"]});
        console.error("Failed to decrypt token:", error);
        return null;
    }
}