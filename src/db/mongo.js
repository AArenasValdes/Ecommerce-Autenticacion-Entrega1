// src/db/mongo.js
import mongoose from 'mongoose';

const MONGO_URL = process.env.MONGO_URL;

let connecting = null;

export async function connectDB() {
  // Si ya está conectada, no hagas nada
  if (mongoose.connection.readyState === 1) return;

  // Evita conexiones paralelas
  if (!connecting) {
    connecting = mongoose.connect(MONGO_URL, { serverSelectionTimeoutMS: 5000 })
      .then(() => {
        console.log('✅ Conectado a MongoDB');
        return mongoose.connection;
      })
      .catch((err) => {
        connecting = null;
        throw err;
      });
  }
  return connecting;
}