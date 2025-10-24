// Archivo de configuración de ejemplo
// Copia este archivo como .env y ajusta los valores según tu entorno

export const config = {
  PORT: process.env.PORT || 3000,
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017",
  MONGO_DB: process.env.MONGO_DB || "ecommerce",
  NODE_ENV: process.env.NODE_ENV || "development",
};
