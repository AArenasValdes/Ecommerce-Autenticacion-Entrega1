import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
title: { type: String, required: true, trim: true },
description: { type: String, required: true, trim: true },
price: { type: Number, required: true, min: 0 },
category: { type: String, required: true, index: true },
stock: { type: Number, required: true, min: 0 },
status: { type: Boolean, default: true, index: true }, // disponibilidad
thumbnails: [{ type: String }],
code: { type: String, required: true, unique: true }
}, { timestamps: true });

export default mongoose.model('Product', ProductSchema);