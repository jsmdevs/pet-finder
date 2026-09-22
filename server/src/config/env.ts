import dotenv from "dotenv";
dotenv.config();

const requiredEnvVars = [
    "DATABASE_URL",
    "SECRET_SIGNATURE",
    "ALGOLIA__APPLICATION_ID",
    "ALGOLIA__API_KEY",
    "RESEND_API",
    "EMAIL_HOST",
    "EMAIL_USER",
    "EMAIL_PASS",
];

for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`[ENV ERROR] La variable de entorno ${envVar} no está definida.`);
    }
}

// Exportar un objeto limpio
export const config = {
    jwtSecret: process.env.SECRET_SIGNATURE,
    dbUri: process.env.DB_URI,
    algoliaAppId: process.env.ALGOLIA__APPLICATION_ID,
    algoliaKey: process.env.ALGOLIA__API_KEY,
    resendApi: process.env.RESEND_API,
    emailHost: process.env.EMAIL_HOST,
    emailUser: process.env.EMAIL_USER,
    emailPass: process.env.EMAIL_PASS,
};