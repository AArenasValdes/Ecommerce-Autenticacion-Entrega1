import mongoose from 'mongoose';

const { MONGO_URI = 'mongodb://localhost:27017', MONGO_DB = 'ecommerce' } = process.env;

try {
await mongoose.connect(`${MONGO_URI}/${MONGO_DB}`);
console.log('✅ Conectado a MongoDB');
} catch (err) {
console.error('❌ Error conectando a MongoDB', err);
process.exit(1);
}