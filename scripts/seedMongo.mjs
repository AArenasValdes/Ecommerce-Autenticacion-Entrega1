import mongoose from 'mongoose';

const { MONGO_URI = 'mongodb://localhost:27017', MONGO_DB = 'ecommerce' } = process.env;
await mongoose.connect(`${MONGO_URI}/${MONGO_DB}`);
console.log('🌱 conectado a Mongo para seed');