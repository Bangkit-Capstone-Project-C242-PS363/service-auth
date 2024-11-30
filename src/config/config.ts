export const config = {
  DB_USER: process.env.DB_USER || "admin",
  DB_HOST: process.env.DB_HOST || "34.50.71.68",
  DB_NAME: process.env.DB_NAME || "main",
  DB_PASSWORD: process.env.DB_PASSWORD || "letmeiinn",
  DB_PORT: parseInt(process.env.DB_PORT || "5432", 10),
};
