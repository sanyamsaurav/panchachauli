import mongoose, { Schema, Model } from 'mongoose';
import type { IProduct } from '@/types/models';

const ProductSchema = new Schema<IProduct>(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            maxlength: [200, 'Title must not exceed 200 characters'],
        },
        slug: {
            type: String,
            required: [true, 'Slug is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be URL-safe (lowercase, hyphens)'],
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            trim: true,
        },
        price: {
            type: String,
            required: [true, 'Price is required'],
            trim: true,
        },
        image: {
            type: String,
            required: [true, 'Image is required'],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        features: [
            {
                type: String,
                trim: true,
            },
        ],
        hero: {
            title: { type: String, required: true },
            subtitle: { type: String, required: true },
            image: { type: String, required: true },
        },
        section2: {
            title: { type: String, required: true },
            description: { type: String, required: true },
            image: { type: String, required: true },
        },
        section3: {
            title: { type: String, required: true },
            description: { type: String, required: true },
            image: { type: String, required: true },
        },
        status: {
            type: String,
            enum: ['draft', 'published'],
            default: 'published',
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

ProductSchema.index({ status: 1, order: 1 });
ProductSchema.index({ title: 'text', category: 'text' });

if (mongoose.models.Product) {
    delete mongoose.models.Product;
}

const Product: Model<IProduct> = mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
